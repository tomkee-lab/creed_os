# CREED OS — Psychometric Data Exposure & Parameter Redaction Matrix
**Release ID:** `v1.0.0-rc1`  
**Governing Standard:** Gate 4 Psychometric Integrity & Child Psychological Safety  
**Engine Package:** `@core-os/assessment` (3PL IRT, 41-Node Gauss-Hermite EAP Quadrature, Maximum Fisher Information)  
**Status:** **`PASS — Verified`**

---

## 1. Network Exposure & Client Bundle Audit

| Psychometric Parameter | Mathematical Symbol | Authorized Internal Layer | Student Web Payload | Parent Report Payload | Teacher Console | Status |
|---|:---:|---|:---:|:---:|:---:|:---:|
| **Item Discrimination** | $a$ | Assessment Item Bank | **WITHHELD** | **WITHHELD** | Item Studio Only | **VERIFIED (Redacted)** |
| **Item Difficulty** | $b$ | Assessment Item Bank | **WITHHELD** | **WITHHELD** | Item Studio Only | **VERIFIED (Redacted)** |
| **Pseudo-Guessing Asymptote** | $c$ | Assessment Item Bank | **WITHHELD** | **WITHHELD** | Item Studio Only | **VERIFIED (Redacted)** |
| **Fisher Information** | $I_i(\theta)$ | Dynamic Selector | **WITHHELD** | **WITHHELD** | Item Studio Only | **VERIFIED (Redacted)** |
| **Latent Ability Estimate** | $\theta$ | EAP Engine | **WITHHELD** | **WITHHELD** | Telemetry Console | **VERIFIED (Redacted)** |
| **Standard Error** | $SE(\theta)$ | EAP Engine | **WITHHELD** | **WITHHELD** | Telemetry Console | **VERIFIED (Redacted)** |
| **Qualitative Growth Tier** | — | Safe DTO Serializer | **`EXPOSED`** | **`EXPOSED`** | Exposed | **VERIFIED (Safe DTO)** |
| **Local Task Activity Score** | — | Safe Evidence DTO | **`EXPOSED`** | **`EXPOSED`** | Exposed | **VERIFIED (Safe DTO)** |

---

## 2. Mathematical Validation & Convergence
- **Gauss-Hermite Quadrature:** Verified integration over 41 nodes spanning $[-4.0, +4.0]$ with step $\Delta = 0.2$.
  - $\mu_0$ (probability mass) error $< 10^{-3}$
  - $\mu_1$ (mean) error $< 10^{-3}$
  - $\mu_2$ (variance) error $< 10^{-2}$
- **Sympson-Hetter Exposure Control:** Prevents item overexposure beyond maximum parameter threshold ($r_{max} \approx 0.20$).
- **Stopping Rule Constraints:** Minimum 5 items, maximum 15 items, or target standard error convergence ($SE \le 0.32$).
