from random import *

# initial state
DATE = 2100
DATE_INC = 20
TEMPERATURE = 22
POPULATION = 1000 # maximum: 100000

POP_INC = 0.2
TEMP_INC = 0.16

WATER = 350000000000 # m3
FOREST = 350000000 # m2
FOSSIL_FUEL = 1 # percent

# development
INDUSTRY = 0 # out of 10
HEALTHCARE = 0 # out of 10
AGRICULTURE = 0 # out of 10
RENEWABLE = 0 # out of 10
LIVING_MODE = 0 # 0, 1, 2

# energy conversion
ENERGY_PER_TREE = 100
ENERGY_PER_FOSSIL_FUEL = 10000000

# resource used
ENERGY_USAGE = [10000000 * i for i in range(11)]
ENERGY_GENERATED = [10 ** i for i in range(11)]


def cal_usage(population, energy_per_capita):
    water_usage = 350 * population * DATE_INC
    energy_usage = population * energy_per_capita
    return (water_usage, energy_usage)

def cal_energy_per_capita(INDUSTRY, LIVING_MODE):
    # linear
    energy_per_capita = INDUSTRY * 10000 * 0.5 * (LIVING_MODE + 1)

    return energy_per_capita

def cal_pop_inc(pop_inc, industry, healthcare, agriculture, temperature):
    curr_pop_inc = pop_inc + 0.01 * industry + 0.01 * healthcare + 0.01 * agriculture - 0.15 * (temperature - TEMPERATURE)

    return curr_pop_inc

def main():
    # init
    date = 2100
    temperature = 22
    population = 1000 # maximum: 100000

    temp_inc = TEMP_INC
    pop_inc = POP_INC

    water = WATER
    forest = FOREST
    fossil_fuel = FOSSIL_FUEL

    # development
    industry = 0 # out of 10
    healthcare = 0 # out of 10
    agriculture = 0 # out of 10
    renewable = 0 # out of 10\
    LIVING_MODE = 0 # 0, 1, 2

    # disease

    while population > 0:
        date += DATE_INC
        print("current year: " + str(date) + "\n")
        print("current population: " + str(population) + "\n")
        print(f"current resources: \nwater - {water}; forest - {forest}; fossil fuel - {fossil_fuel * 100}%;")
        print(f"current technology: \nindustry - {industry}; healthcare - {healthcare}; agriculture - {agriculture}; renewable - {renewable}\n")

        has_industry = input("develop industry? [Y/N]\n")
        has_healthcare = input("develop healthcare? [Y/N]\n")
        has_agriculture = input("develop agriculture? [Y/N]\n")
        has_renewable = input("develop renewable? [Y/N]\n")
        curr_living_mode = input("choose living mode: [L/M/H]\n")

        if industry < 10:
            industry += int(has_industry == 'Y')
            
        if healthcare < 10:
            healthcare += int(has_healthcare == 'Y')
            
        if agriculture < 10:
            agriculture += int(has_agriculture == 'Y')
            
        if renewable < 10:
            renewable += int(has_renewable == 'Y')
            
        curr_living_mode = 0 if curr_living_mode == 'L' else 1 if curr_living_mode == 'M' else 2

        energy_per_capita = cal_energy_per_capita(industry, curr_living_mode)

        water_usage, energy_usage = cal_usage(population, energy_per_capita)

        energy_usage += ENERGY_USAGE[industry] + ENERGY_USAGE[healthcare] + ENERGY_USAGE[agriculture] + ENERGY_USAGE[renewable]

        energy_consumed = energy_usage - ENERGY_GENERATED[renewable] if energy_usage > ENERGY_GENERATED[renewable] else 0

        pop_inc = cal_pop_inc(pop_inc, industry, healthcare, agriculture, temperature)
        population = int(population * (1 + pop_inc))

        if fossil_fuel != 0 and forest != 0:

            energy_consumed_by_fossil_fuel = energy_consumed * fossil_fuel * ENERGY_PER_FOSSIL_FUEL / (fossil_fuel * ENERGY_PER_FOSSIL_FUEL + forest * ENERGY_PER_TREE)

            fossil_fuel -= energy_consumed_by_fossil_fuel / ENERGY_PER_FOSSIL_FUEL

            

            if fossil_fuel < 0:
                fossil_fuel = 0

            forest -= (energy_consumed - energy_consumed_by_fossil_fuel) / ENERGY_PER_TREE

            if forest < 0:
                forest = 0

        else:
            population = ENERGY_GENERATED[renewable] // energy_per_capita

        water -= water_usage

        if water < 0:
            water = 0
            population = -1

        # disease
        disease = randint(1,11)
        disease_kill = max((disease - healthcare) * 100, int((disease - healthcare) / 10 * population))
        if disease_kill < 0:
            disease_kill = 0
        elif disease_kill > population:
            disease_kill = population
        population -= disease_kill
        print(f"You experience a disease of severity level {disease} and {disease_kill} people died.")

    print(f"Human die out. You have survived for {date - DATE} years.");

        

 
