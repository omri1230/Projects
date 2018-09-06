import random
from random import randint


def SlottedAloha(Amount):
    Array = []
    CountCollision = 0
    for x in range(Amount):
        Array.append(randint(0, 3 * Amount))
        Array.sort()
    for x in range(len(Array) - 1):
        if Array[x] == Array[x + 1]:
            CountCollision = CountCollision + 1
    print("Amount of packets is: " + str(Amount))
    print("Amount of collision is: " + str(CountCollision))
    print("Throughput is: " + str(Amount - CountCollision))
    print()


SlottedAloha(10)
SlottedAloha(100)
SlottedAloha(1000)
SlottedAloha(10000)