import { ServiceBusClient } from '@azure/service-bus';
import { Injectable, Logger } from '@nestjs/common';
import { Subject, Subscription } from 'rxjs';
import { File } from 'src/files/dto/file.dto';
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
    private readonly fileReceiver: Subject<File> = new Subject<File>();

    constructor() {
        this.logger.debug(ServicebusService.connectionStringSender);
        this.logger.debug(ServicebusService.connectionStringReceiver);
        const fileReceiverHandler = async (file: any) => {
            const f: File = {
                fileName: file.fileName,
                userName: file.userName,
                text: file.text,
                title: file.title,
                tags: file.tags
            }
            this.logger.debug(`received: ${JSON.stringify(f)}`);
            this.receiveFromServiceBus(file);
        }
        const errorHandler = async (err: any) => {
            return this.logger.error(JSON.stringify(err));
        };
        this.fileReceiverClient.subscribe({
            processMessage: fileReceiverHandler,
            processError: errorHandler
        });
    }

    public subscribeToReveiver(subj: Subject<File>): Subscription {
        return this.fileReceiver.subscribe(subj);
    }

    public subscribeSender(subject: Subject<File>): Subscription {
        return subject.subscribe(x => this.sendToServiceBus(x));
    }

    private async sendToServiceBus(file: File)  {
        this.logger.debug(`send: ${JSON.stringify(file)}`);
        this.fileSenderClient.sendMessages({ body: file });
    }

    private receiveFromServiceBus(file: File): void {
        this.fileReceiver.next(file);
    }
}
