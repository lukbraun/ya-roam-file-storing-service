

abstract class Entity<E> {
    protected static fieldName: string;
    constructor(protected model: E, private readonly id: string) { }

    public set(model: E) {
        this.model = model;
    }

    public get(): E {
        return this.model;
    }

    public getId() {
        return this.id;
    }

    abstract addV(): DatabaseStatement;

    public addEdgeTo<T, TargetEntity extends Entity<T>>(target: TargetEntity, relationShip: string): DatabaseStatement {
        return {
            stmt: "g.V(source).addE(relationship).to(g.V(target))",
            params: {
                source: this.id,
                relationship: relationShip,
                target: target.getId()
            }
        }
    }
}
