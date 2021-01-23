import { File } from './file.entity'

export class EmptyFile extends File {
    constructor(name: string = "!!EMPTY!!") {
        super(name, "", "");
    }

    addV(): DatabaseStatement {
        throw new Error("File is Empty -> Won't be pushed to db");
    }
}
