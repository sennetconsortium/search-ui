export class ProvenanceConstraints {
    constructor(constraints) {
        this.constraints = constraints.prov_constraints
    }

    getValidDescendants(userChosenAncestor) {
        for (let constraint of this.constraints) {
            const entityConstraint = constraint.entity_constraint
            const entityConstraintAncestor = entityConstraint.ancestor;
            const ancestorConstraintEntityType = entityConstraintAncestor.entity_type
            if (ancestorConstraintEntityType.toLowerCase() === userChosenAncestor.entity_type.toLowerCase()) {
                if (!Object.hasOwn(entityConstraintAncestor, 'field_values')) {
                    return entityConstraint.descendant
                } else {
                    for (const ancestorConstraintField of entityConstraintAncestor.field_values) {
                        for (const userChosenAncestorFieldValue of userChosenAncestor.field_values) {
                            if (ancestorConstraintField.field_value.name.toLowerCase() === userChosenAncestorFieldValue.field_value.name) {
                                for (const userChosenAncestorValue of userChosenAncestorFieldValue.field_value.values) {
                                    if (ancestorConstraintField.field_value.values.includes(userChosenAncestorValue)) {
                                        return entityConstraint.descendant
                                    }
                                }
                            }
                        }
                    }
                }

            }
        }
    }
}