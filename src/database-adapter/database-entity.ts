
export abstract class Entity {
    constructor(public readonly id: string, public readonly nameOfIdField: string, public readonly label: string) { }

    abstract addV(): DatabaseStatement;

    public addEdgeTo(target: Entity, relationShip: string): DatabaseStatement {
        return {
           // g.V().has('person','name','vadas').as('v').
           // V().has('software','name','ripple').
           // coalesce(__.inE('created').where(outV().as('v')),
           //          addE('created').from('v').property('weight',0.5))
            stmt: "g.V().hasLabel(sourceLabel).has(nameOfIdFieldSource, source).as('v'). \
                   V().hasLabel(targetLabel).has(nameOfIdFieldTarget, target). \
                   coalesce(__.inE(relationship).where(outV().as('v')), \
                            addE(relationship).from('v'))",
            params: {
                sourceLabel: this.label,
                nameOfIdFieldSource: this.nameOfIdField,
                source: this.id,
                relationship: relationShip,
                targetLabel: target.label,
                nameOfIdFieldTarget: target.nameOfIdField,
                target: target.id
            }
        }
    }
}
