# Core_OS — Psychometrics & Computerized Adaptive Testing (CAT) Specification

**Document Version:** 1.0.0  
**Status:** Mathematical & Algorithmic Baseline  
**Audience:** Psychometricians, Algorithm Engineers, Data Scientists  

---

## 1. Theoretical Foundation: 3-Parameter Logistic (3PL) IRT

Core_OS rejects classical test theory (percentage scores) in favor of **Item Response Theory (IRT)**. Under the 3-Parameter Logistic (3PL) model, the probability that a learner with latent ability $\theta \in (-\infty, +\infty)$ correctly answers item $i$ is defined as:

$$P_i(\theta) = c_i + \frac{1 - c_i}{1 + \exp\left(-1.702 \cdot a_i (\theta - b_i)\right)}$$

Where:
- $\theta$: Latent learner ability on a standard normal scale (typically normalized such that $\theta \sim \mathcal{N}(0, 1)$ across a reference cohort, where 0 is population mean).
- $a_i \in (0, 2.5]$: **Item Discrimination Parameter** — the slope of the item response function at its steepest point, indicating how effectively the item differentiates between learners above and below its difficulty.
- $b_i \in [-3.0, +3.0]$: **Item Difficulty Parameter** — the point on the ability continuum where the probability of a correct response is midway between $c_i$ and 1.0.
- $c_i \in [0.0, 0.35]$: **Pseudo-Guessing Parameter** — the lower asymptote of the curve, representing the probability that a learner with very low ability ($\theta \to -\infty$) answers correctly by guessing (e.g., 0.25 for 4-option multiple choice).
- $1.702$: Scaling constant ensuring maximum approximation to the normal ogive model.

---

## 2. Fisher Information Function

The precision of measurement provided by item $i$ at ability level $\theta$ is quantified by the **Fisher Information Function** $I_i(\theta)$:

$$I_i(\theta) = \frac{\left(P'_i(\theta)\right)^2}{P_i(\theta) \cdot Q_i(\theta)}$$

Where $Q_i(\theta) = 1 - P_i(\theta)$. Substituting the 3PL derivative:

$$P'_i(\theta) = 1.702 \cdot a_i \cdot \frac{1 - c_i}{\left(1 + \exp(-1.702 a_i (\theta - b_i))\right)^2} \cdot \exp(-1.702 a_i (\theta - b_i))$$

Which simplifies to:

$$I_i(\theta) = (1.702 \cdot a_i)^2 \cdot \frac{Q_i(\theta)}{P_i(\theta)} \cdot \left(\frac{P_i(\theta) - c_i}{1 - c_i}\right)^2$$

For a test of $K$ administered items, the **Test Information Function** is additive:

$$I(\theta) = \sum_{k=1}^K I_{i_k}(\theta)$$

---

## 3. Ability Estimation: Expected A Posteriori (EAP)

Core_OS uses **Expected A Posteriori (EAP)** numerical quadrature for real-time ability estimation. EAP is strictly bounded, computationally robust, avoids infinite singularities when a student gets all items right or wrong, and naturally incorporates a Gaussian prior distribution $g(\theta) \sim \mathcal{N}(0, 1)$.

Given a vector of responses $\mathbf{u} = [u_1, u_2, \dots, u_K]$ where $u_k \in \{0, 1\}$:

### 3.1 Likelihood Function
$$L(\mathbf{u} \mid \theta) = \prod_{k=1}^K \left[P_{i_k}(\theta)\right]^{u_k} \cdot \left[1 - P_{i_k}(\theta)\right]^{1 - u_k}$$

### 3.2 Numerical Quadrature Formulation
We evaluate the integral over $Q = 41$ Gauss-Hermite quadrature nodes $X_q \in [-4.0, +4.0]$ with corresponding standard normal weights $W(X_q)$:

$$\hat{\theta}_{\text{EAP}} = \frac{\sum_{q=1}^Q X_q \cdot L(\mathbf{u} \mid X_q) \cdot W(X_q)}{\sum_{q=1}^Q L(\mathbf{u} \mid X_q) \cdot W(X_q)}$$

### 3.3 Posterior Standard Error of Measurement ($SE(\hat{\theta})$)
$$SE(\hat{\theta}_{\text{EAP}}) = \sqrt{\frac{\sum_{q=1}^Q (X_q - \hat{\theta}_{\text{EAP}})^2 \cdot L(\mathbf{u} \mid X_q) \cdot W(X_q)}{\sum_{q=1}^Q L(\mathbf{u} \mid X_q) \cdot W(X_q)}}$$

As items are administered, $SE(\hat{\theta})$ diminishes monotonically, providing a rigorous mathematical index of measurement certainty.

---

## 4. Computerized Adaptive Testing (CAT) Engine

```text
               Start Diagnostic Session
                         │
                         ▼
        Initialize θ_0 = 0.0, SE_0 = 1.0
                         │
        ┌────────────────┼────────────────┐
        │                ▼                │
        │      Filter Eligible Items      │ ◄── Competency Blueprint & Exposure
        │                │                │
        │                ▼                │
        │   Evaluate Fisher Information   │ ◄── I_i(θ_current)
        │                │                │
        │                ▼                │
        │   Deliver Highest Info Item     │
        │                │                │
        │                ▼                │
        │    Receive Student Response     │
        │                │                │
        │                ▼                │
        │   Update θ & SE via 3PL EAP     │
        │                │                │
        │                ▼                │
        │    Check Termination Criteria   │
        └────────────────┬────────────────┘
                         │
        ┌────────────────┴────────────────┐
   Criteria Met                      Criteria Unmet
        ▼                                 │
End Session & Emit Evidence               └─► Loop Next Item
```

### 4.1 Item Selection Strategy: Maximum Fisher Information with Exposure Control
At step $k$:
1. Identify remaining unadministered items satisfying the blueprint domain constraints.
2. Calculate $I_i(\hat{\theta}_{k-1})$ for each candidate.
3. Apply the Sympson-Hetter exposure control algorithm to prevent overexposure of high-information anchor items.
4. Select the item with maximum constrained information.

### 4.2 Dynamic Stopping Rules
An adaptive session halts when either condition is fulfilled:
1. **Precision Criterion:** $SE(\hat{\theta}) \le 0.32$ (equivalent to classical reliability $r_{xx} \ge 0.90$).
2. **Length Constraints:** Minimum 6 items (to prevent premature convergence), Maximum 15 items (to prevent cognitive fatigue in young learners).

---

## 5. Security & Parameter Obfuscation

> [!CAUTION]
> Under no circumstances are the item psychometric parameters ($a_i, b_i, c_i$) transmitted to the client application.

1. **Client Isolation:** The browser receives only the item text, stimulus diagrams, and response options.
2. **Server-Authoritative Evaluation:** Responses are submitted to `/api/v1/assessments/sessions/:id/responses`. The backend executes scoring, EAP update, and next-item selection in secure server memory.
3. **Cheat Resistance:** Because item presentation depends on live latent state estimation and server-side Fisher information, fixed answer keys cannot be scraped or shared among students.

---

## 6. Diagnostic Misconception Taxonomy

Each distractor (incorrect option) in an assessment item is mapped to a specific conceptual misconception code:

```json
{
  "itemId": "ITEM-MATH-ALG-042",
  "stem": "Solve for x: 3x + 7 = 22",
  "correctOptionId": "opt-c",
  "distractors": [
    {
      "optionId": "opt-a",
      "value": "x = 9.66",
      "misconceptionCode": "MISC_SIGN_INVERSION",
      "description": "Added 7 to 22 instead of subtracting (3x = 29)"
    },
    {
      "optionId": "opt-b",
      "value": "x = 5",
      "misconceptionCode": "MISC_ARITHMETIC_ERROR",
      "description": "Subtracted 7 correctly (15) but misdivided by 3"
    },
    {
      "optionId": "opt-d",
      "value": "x = 12",
      "misconceptionCode": "MISC_OPERATOR_PRECEDENCE",
      "description": "Divided 22 by 3 first before dealing with constant"
    }
  ]
}
```

When a student selects an incorrect distractor, the system does not merely mark it $0$; it writes a targeted misconception record into the learner's evidence graph, driving immediate remediation.
