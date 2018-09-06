from Lib import copy
from math import inf

edges = {
    'a': {'b': 8, 'e': 3, 'f': 1},
    'b': {'c': 2, 'a': 8},
    'c': {'f': 3, 'b': 2},
    'd': {'e': 7, 'f': 5, 'g': 2},
    'e': {'f': 4, 'g': 1, 'a': 3, 'd': 7},
    'f': {'a': 1, 'c': 3, 'e': 4, 'd': 5},
    'g': {'d': 2, 'e': 1}
}
#ex1
def LSR(graph):
    for Ver in graph:
        SD = {}
        Pre = {}
        tmp = copy.deepcopy(graph)
        for node in tmp:
            SD[node] = inf
        SD[Ver] = 0

        while tmp:
            MinN = None
            for no in tmp:
                if MinN is None:
                    MinN = no
                elif SD[no] < SD[MinN]:
                    MinN = no
            for ChildN, w in graph[MinN].items():
                if w + SD[MinN] < SD[ChildN]:
                    SD[ChildN] = w + SD[MinN]
                    Pre[ChildN] = MinN
            tmp.pop(MinN)

        for no in graph:
            CurrentN = no
            path = []
            while CurrentN != Ver:
                try:
                    path.insert(0, CurrentN)
                    CurrentN = Pre[CurrentN]
                except KeyError:
                    print("Path is not reachable")
                    break
            if SD[no] != inf:
                string_path = str(Ver) + '-'
                for i in path:
                    string_path += i + "-"
                string_path = string_path[:-1]
                print('<' + Ver + ': ' + no + ' <' + string_path + '> ' + str(SD[no]) + '>')



LSR(edges)