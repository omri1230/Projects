import random
from random import randint


def PureAloha(Amount,SizePacket):
    Array = []
    CountCollision = 0
    for x in range(Amount):
        Array.append(random.uniform(0, 1))
        Array.sort()
    for x in range(len(Array) - 1):
        if Array[x] + SizePacket > Array[x + 1]:
            CountCollision = CountCollision + 1
    print("Packet size is:" + str(SizePacket))
    print("Amount of packets is: " + str(Amount))
    print("Amount of collision is: " + str(CountCollision))
    print("Throughput is: " + str(Amount - CountCollision))
    print()


size = 0.000001
for i in range(10):
    PureAloha(10, size)
    PureAloha(100, size)
    PureAloha(1000, size)
    PureAloha(10000, size)
    size = size + 0.0000001