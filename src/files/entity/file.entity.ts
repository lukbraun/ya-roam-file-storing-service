
export class File extends Entity {
  constructor(public filename: string, public username: string, public text: string) {
    super(filename);
  }
  addV(): DatabaseStatement {
    return {
      stmt: "g.addV(label).property('username', username).property('filename', filename).property('text', text)",
      params: {
        userName: this.username,
        filename: this.filename,
        text: this.text
      }
    }
  }
}
