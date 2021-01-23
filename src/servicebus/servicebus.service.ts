import { ServiceBusClient } from '@azure/service-bus';
import { Injectable, Logger } from '@nestjs/common';
import { Subject, Subscription } from 'rxjs';
import { UpdateFile } from 'src/files/dto/updateFile.dto';
import { File } from 'src/files/dto/file.dto'
const queueReceiver = "insertfile";
const queueSenderForParse = "parsefile";

@Injectable()
export class ServicebusService {
    private static readonly connectionStringSender = process.env.AZURE_SERVICEBUS_ENDPOINT;
    private static readonly connectionStringReceiver = process.env.AZURE_SERVICEBUS_RECEIVE;
    private readonly logger = new Logger(ServicebusService.name);
    private readonly sbclient: ServiceBusClient = new ServiceBusClient(ServicebusService.connectionStringSender);
    private readonly fileSenderClient = this.sbclient.createSender(queueSenderForParse);
    private readonly fileReceiverClient = this.sbclient.createReceiver(queueReceiver);
    private readonly fileReceiver: Subject<UpdateFile> = new Subject<UpdateFile>();

    private static getFromMessage(name: string[]): any {
        return (acc, res) => {
            if (name.includes(res.type)) {
                res.value.forEach(x => {
                    acc.push(x)
                })
            }
            return acc;
        };
    }

    constructor() {
        this.logger.debug(ServicebusService.connectionStringSender);
        this.logger.debug(ServicebusService.connectionStringReceiver);
        const fileReceiverHandler = async (file: any) => {
            const title = file.body.value.reduce(ServicebusService.getFromMessage(["alias", "title"]), []);
            const tags = file.body.value.reduce(ServicebusService.getFromMessage(["tags"]), []);
            const references = file.body.value.reduce(ServicebusService.getFromMessage(["reference"]), []);
            const f: UpdateFile = {
                fileName: file.body.fileName,
                title: title,
                tags: tags,
                references: references
            }
            this.logger.debug(`Received & created: ${JSON.stringify(f)}`);
            this.receiveFromServiceBus(f);
        }
        const errorHandler = async (err: any) => {
            return this.logger.error(JSON.stringify(err));
        };
        this.fileReceiverClient.subscribe({
            processMessage: fileReceiverHandler,
            processError: errorHandler
        });
    }

    public subscribeToReveiver(subj: Subject<UpdateFile>): Subscription {
        return this.fileReceiver.subscribe(subj);
    }

    public subscribeSender(subject: Subject<File>): Subscription {
        return subject.subscribe(x => this.sendToServiceBus(x));
    }

    private async sendToServiceBus(file: File) {
        this.logger.debug(`send: ${JSON.stringify(file)}`);
        this.fileSenderClient.sendMessages({ body: file });
    }

    private receiveFromServiceBus(file: UpdateFile): void {
        this.fileReceiver.next(file);
    }
}
