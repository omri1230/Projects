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



def DVR(graph):
    tmp = copy.deepcopy(graph)
    for n in tmp:
        print('CURRENT: ' + n)
        D, Pre = {}, {}
        for no in tmp:
            D[no], Pre[no] = inf, None
            D[n] = 0
        count_iter = 1;
        for _ in range(len(tmp) - 1):
            for no in tmp:
                for Neig in tmp[no]:
                    if D[Neig] > D[no] + tmp[no][Neig]:
                        D[Neig], Pre[Neig] = D[no] + tmp[no][Neig], no
                        for Ver in graph:
                            CurrentN = Ver
                            path = []
                            while CurrentN != n:
                                try:
                                    path.insert(0, CurrentN)
                                    CurrentN = Pre[CurrentN]
                                except KeyError:
                                    break
                            if D[Ver] != inf:
                                string_path = str(n) + '-'
                                for i in path:
                                    string_path += i + "-"
                                string_path = string_path[:-1]
                                print(str(count_iter) +'. <' + n + ': ' + Ver + ' <' + string_path + '> ' + str(
                                    D[Ver]) + '>')
                                count_iter += 1


DVR(edges)