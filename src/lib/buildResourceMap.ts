import type { DotASTNode, EdgeASTNode, NodeASTNode } from "ts-graphviz/ast";
import cleanID from "./cleanID";

export const throughRegexp = new RegExp("(^|\\.)(var|local|output)\\.");

export const moduleRegexp = new RegExp("(^|\\.)module\\.(\\w+)$");

export type ResourceMap = {
  resources: string[];
  map: Record<string, { dependencies: string[]; dependents: string[] }>;
  // skipVarsMap: Record<
  //   string,
  //   { dependencies: Set<string>; dependents: Set<string> }
  // >;
};
export default function buildResourceMap(root: DotASTNode): ResourceMap {
  let graphNodes = root.children[0].children[2].children;
  let resources = graphNodes.filter((r) => r.type == "Node") as NodeASTNode[];
  let edges = graphNodes.filter((r) => r.type == "Edge") as EdgeASTNode[];

  const map: ResourceMap = { resources: [], map: {} };

  resources.forEach((resource) => {
    const id = cleanID(resource.id.value);
    if (!id.startsWith("provider")) {
      map.map[id] ||= {
        dependencies: [],
        dependents: [],
      };
    }
  });

  edges.forEach((edge) => {
    let [from, to] = edge.targets;
    if (from?.type == "NodeRef" && to?.type == "NodeRef") {
      const fromID = cleanID(from?.id.value);
      const toID = cleanID(to?.id.value);

      if (!fromID.startsWith("provider") && !toID.startsWith("provider")) {
        map.map[fromID] ||= { dependencies: [], dependents: [] };
        map.map[fromID].dependencies.push(toID);
        map.map[toID] ||= { dependencies: [], dependents: [] };
        map.map[toID].dependents.push(fromID);
      }
    }
  });

  map.resources = Object.keys(map.map);

  // const mergeResources: string[] = [];
  // map.resources.forEach((resource) => {
  //   if (mergeRegexp.test(resource)) {
  //     mergeResources.push(resource);
  //   }
  //   map.skipVarsMap[resource] = {
  //     dependencies: new Set(map.map[resource].dependencies),
  //     dependents: new Set(map.map[resource].dependents),
  //   };
  // });

  // let allMerged = false;

  // while (!allMerged) {
  //   allMerged = true;
  //   mergeResources.forEach((resource) => {
  //     if (map.skipVarsMap[resource]) {
  //       map.skipVarsMap[resource].dependencies.forEach((dep) => {
  //         map.skipVarsMap[dep] ||= {
  //           dependencies: new Set(),
  //           dependents: new Set(),
  //         };
  //         map.skipVarsMap[resource].dependents.forEach((depdep) =>
  //           map.skipVarsMap[dep].dependents.add(depdep)
  //         );
  //       });
  //       map.skipVarsMap[resource].dependents.forEach((dep) => {
  //         map.skipVarsMap[dep] ||= {
  //           dependencies: new Set(),
  //           dependents: new Set(),
  //         };
  //         map.skipVarsMap[resource].dependencies.forEach((depdep) =>
  //           map.skipVarsMap[dep].dependencies.add(depdep)
  //         );
  //       });
  //       delete map.skipVarsMap[resource];
  //       allMerged = false;
  //     }
  //   });
  // }

  return map;
}
