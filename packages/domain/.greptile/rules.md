# Domain Logic & State Machine Review Rules

## 1. Parental Consent State Machine
The learner lifecycle requires verified consent from a parent or legal guardian for all users under 18 (DPDP Act):

```
       ┌──────────┐
       │  DRAFT   │
       └────┬─────┘
            │ inviteParent()
            ▼
┌───────────────────────┐
│    PARENT_INVITED     │
└───────────┬───────────┘
            │ initiateConsent()
            ▼
┌───────────────────────┐
│PARENT_CONSENT_PENDING │
└───────────┬───────────┘
            │ verifyAndSign()
            ▼
┌───────────────────────┐
│   PARENT_CONSENTED    │
└───────────────────────┘
```

- Any attempt to access learner features without `PARENT_CONSENTED` state must be rejected with `ConsentRequiredError`.
- Consent revocation immediately transitions to `WITHDRAWN` and halts all automated processing.

## 2. Effect Pipeline Standards
- Use `Effect.gen(function* () { ... })` for sequential domain pipelines.
- Compose pipelines using pipe operators: `Effect.pipe(workflow, Effect.catchTag(...))`.
- All environment requirements must be represented as `Context.Tag`.
