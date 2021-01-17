import { Entity } from "src/database-adapter/database-entity";

export class File extends Entity {
  constructor(public filename: string, public username: string, public text: string) {
    super(filename);
  }
  addV(): DatabaseStatement {
    return {
      stmt: "g.addV(label).property('yaroam', filename).property('filename', filename).property('username', username).property('text', text)",
      params: {
        label: "File",
        username: this.username,
        filename: this.filename,
        text: this.text
      }
    }
  }
}
