---
title: "Scalable multi-product inventory control with lead time constraints using reinforcement learning"
authors:
- Hardik Meisheri
- Nazneen N Sultana
- Mayank Baranwal
- Vinita Baniwal
- Somjit Nath
- Satyam Verma
- Balaraman Ranvindran
- Harshad Khadilkar


image:
  caption: "Model Architecture"
  focal_point: ""

date: 2021-05-28
# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ["2"]
publication: 'Neural Computing and Applications'
publication_short:  In * Neural Comput & Applic (2021)*

abstract: Determining optimum inventory replenishment decisions is critical for retail businesses with uncertain demand. The problem becomes particularly challenging when multiple products with different lead times and cross-product constraints are considered. This paper addresses the aforementioned challenges in multi-product, multi-period inventory management using deep reinforcement learning (deep RL). The proposed approach improves upon existing methods for inventory control on three fronts (i) concurrent inventory management of a large number (hundreds) of products under realistic constraints, (ii) minimal retraining requirements on the RL agent under system changes through the definition of an individual product meta-model, (iii) efficient handling of multi-period constraints that stem from different lead times of different products. We approach the inventory problem as a special class of dynamical system control, and explain why the generic problem cannot be satisfactorily solved using classical optimisation techniques. Subsequently, we formulate the problem in a general framework that can be used for parallelised decision-making using off-the-shelf RL algorithms. We also benchmark the formulation against the theoretical optimum achieved by linear programming under the assumptions that the demands are deterministic and known apriori. Experiments on scales between 100 and 220 products show that the proposed RL-based approaches perform better than the baseline heuristics, and quite close to the theoretical optimum. Furthermore, they are also able to transfer learning without retraining to inventory control problems involving different number of products.

tags:
  - Reinforcement Learning
  - Supply Chain
  - Deep Learning

links:
- name: Paper
  url: https://link.springer.com/article/10.1007/s00521-021-06129-w

projects:
- Reinforcement Learning in Supply Chain Optimization

---
