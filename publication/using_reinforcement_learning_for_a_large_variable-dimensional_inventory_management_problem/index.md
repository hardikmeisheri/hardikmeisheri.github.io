---
title: "Using Reinforcement Learning for a Large Variable-Dimensional Inventory Management Problem"
authors:
- Hardik Meisheri
- Vinita Baniwal
- Nazneen N Sultana
- Harshad Khadilkar
- Balaraman Ranvindran

image:
  caption: "Model Architecture"
  focal_point: ""

date: 2020-05-09
publication_types: ["1"]
publication: 'Adaptive and Learning Agents Workshop, AAMAS'
publication_short: In *ALA, AAMAS*

abstract: This paper evaluates the applicability of reinforcement learning (RL) to multi-product inventory management in supply chains. The novelty of this problem with respect to supply chain literature is (i) we consider concurrent inventory management of a large number (hundreds) of products under realistic constraints such as shared capacity, and (ii) the number of products (size of the problem) can change frequently, implying that the RL agent needs to work in this regime without retraining. We approach the problem as a special class of dynamical system control, and explain why the generic problem cannot be satisfactorily solved using classical optimisation techniques. Subsequently, we formulate the problem in a reinforcement learning framework that can be used for parallelised decision-making, and use the advantage actor critic (A2C) and deep Q-network (DQN) algorithms with quantised action spaces to solve the problem. Experiments on scales between 100 and 220 products show that these approaches perform better than other baseline algorithms. They are also able to transfer learning without retraining, when the number of products change.

tags:
  - Reinforcement Learning
  - Supply Chain
  - Deep Learning

links:
- name: Paper
  url: https://ala2020.vub.ac.be/papers/ALA2020_paper_5.pdf

projects:
- Reinforcement Learning in Supply Chain Optimization

---
