import { Injectable, Logger } from '@nestjs/common';
import { Subject, Subscription } from 'rxjs';
import { DatabaseAdapterService } from 'src/database-adapter/database-adapter.service';
import { ServicebusService } from 'src/servicebus/servicebus.service';
import { Tag } from 'src/tags/entity/tag.entity';
import { Title } from 'src/title/entity/title.entity';
import { CreateFile } from './dto/createFile.dto';
import { File as FileDto } from './dto/file.dto';
import { UpdateFile } from './dto/updateFile.dto';
import { File } from './entity/file.entity';
import { EmptyFile } from './entity/emptyFile.entity';

@Injectable()
export class FilesService {
    private logger = new Logger(FilesService.name);
    private sendTo = new Subject<FileDto>();
    private subSender: Subscription;
    private subReceiveParsed: Subscription;
    private subReceiveCreateFile: Subscription;

    constructor(
        private db: DatabaseAdapterService, private sb: ServicebusService
    ) {
        this.subSender = this.sb.subscribeSender(this.sendTo);
        this.subReceiveParsed = this.sb.subscribeToReveiver(FilesService.handleUpdate(this));
        this.subReceiveCreateFile = this.sb.subscribeToCreateFileReceiver(FilesService.handleInsertFile(this));
    }

    public fileToFileDto(entity: File): FileDto {
        return {
            fileName: entity.filename,
            userName: entity.username,
            text: entity.text,
            title: [], // TODO: Find all Tags
            tags: [] // TODO: Find all Titles
        }
    }

    private static handleInsertFile(fs: FilesService) {
        return async (info: CreateFile) => {
            fs.create(info);
        }
    }

    private static handleUpdate(fs: FilesService) {
        return async (info: UpdateFile) => {
            const file = await fs.getByFilename(info.fileName);
            info.tags.map(x => new Tag(x)).forEach(x => {
                fs.db.addVertex(x).then(_ => {
                    const stmtE = file.addEdgeTo(x, "hasTag");
                    fs.db.runStatement(stmtE).catch(fs.logger.error);
                })
            });
            info.title.map(x => new Title(x)).forEach(x => {
                fs.db.addVertex(x).then(_ => {
                    const stmtE = file.addEdgeTo(x, "hasTitle");
                    fs.db.runStatement(stmtE).catch(fs.logger.error);
                })
            });
            info.references.map(x => fs.getByFilename(x))
                .forEach(async ref => {
                    const aref = await ref;
                    if (aref instanceof EmptyFile) {
                        const f = new File(aref.filename, "unkown", "");
                        fs.db.addVertex(f).then(_ => {
                            const stmtE = file.addEdgeTo(f, "references");
                            fs.db.runStatement(stmtE).catch(fs.logger.error)
                        })
                    } else {
                        const stmtE = file.addEdgeTo(aref, "references");
                        fs.db.runStatement(stmtE).catch(fs.logger.error);
                    }
                });
        }
    }
    private async handleParsedInfo(info: UpdateFile) {
        const file = await this.getByFilename(info.fileName);
        info.tags.map(x => new Tag(x)).forEach(x => {
            x.addV();
            file.addEdgeTo(x, "hasTag");
        });
        info.tags.map(x => new Title(x)).forEach(x => {
            x.addV();
            file.addEdgeTo(x, "hasTitle");
        });
        info.references.map(x => this.getByFilename(x))
            .forEach(async ref => {
                const aref = await ref;
                if (aref instanceof EmptyFile) {
                    const f = new File(aref.filename, "unkonwn", "");
                    f.addV();
                    file.addEdgeTo(f, "references");
                } else {
                    file.addEdgeTo(aref, "references");
                }
            });
    }

    private getFileFromResult(_properties: any): File {
        return new File(_properties.filename[0].value, _properties.username[0].value, _properties.text[0].value);
    }

    async create(file: CreateFile) {
        const entity = new File(file.fileName, file.userName, file.text);
        this.sendTo.next(this.fileToFileDto(entity));
        return this.db.addVertex(entity)
            .then(element => this.getFileFromResult(element._items[0].properties))
            .catch(reason => {
                this.logger.error(reason);
                return reason;
            });
    }

    async getAll(): Promise<File[]> {
        return this.db.getAll('File').then(res =>
            res.map(this.getFileFromResult)
        );
    }

    async getByFilename(filename: string): Promise<File> {
        const stmt: DatabaseStatement = {
            stmt: "g.V().hasLabel('File').has('filename', filename)",
            params: {
                filename: filename
            }
        }
        return this.db.runStatement(stmt).then(res => {
            return this.getFileFromResult(res._items[0].properties);
        }).catch(_ => new EmptyFile(filename))
    }

    async remove(filename: string): Promise<boolean> {
        const stmt: DatabaseStatement = {
            stmt: "g.V().hasLabel(label).has('name', name).drop()",
            params: {
                label: "File",
                name: filename
            }
        }
        return this.db.runStatement(stmt).then(_ => true);
    }
}
