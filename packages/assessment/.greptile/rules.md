# Psychometrics & Assessment Engine Review Guidelines

## 1. Mathematical Formulas & Invariants

### 3PL Item Response Theory (IRT)
The probability of a correct response $P_i(\theta)$ given latent ability $\theta$:

$$P_i(\theta) = c_i + \frac{1 - c_i}{1 + e^{-D \cdot a_i (\theta - b_i)}}$$

Where:
- $D = 1.702$ (scaling factor for normal ogive approximation)
- $a_i$: Item discrimination ($a \in [0.2, 3.0]$)
- $b_i$: Item difficulty ($b \in [-3.5, 3.5]$)
- $c_i$: Pseudo-guessing parameter ($c \in [0.0, 0.35]$)

### Expected A Posteriori (EAP) Estimation
Ability $\hat{\theta}$ is computed via Gauss-Hermite numerical quadrature:

$$\hat{\theta}_{EAP} = \frac{\sum_{k=1}^K X_k \cdot L(X_k | \mathbf{u}) \cdot W(X_k)}{\sum_{k=1}^K L(X_k | \mathbf{u}) \cdot W(X_k)}$$

Where $K \ge 21$ nodes spanning $[-4.0, +4.0]$.

### Fisher Information
$$I_i(\theta) = D^2 a_i^2 \frac{1 - P_i(\theta)}{P_i(\theta)} \left(\frac{P_i(\theta) - c_i}{1 - c_i}\right)^2$$

## 2. Review Checklist
- [ ] No `Math.random()` in scoring or ability calculation.
- [ ] Precision: Double-precision floating point calculations. Guard against division by zero ($P_i(\theta) = 0$).
- [ ] Pure functional design: Assessment evaluation functions must be deterministic and side-effect free.
- [ ] Unit test coverage: Every item selection or score estimator mutation must include golden data tests.
