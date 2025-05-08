export class Queue {
    queueId: string;
    serviceRequestIds: string[];
    priority: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(queueId: string, serviceRequestIds: string[], priority: number) {
        this.queueId = queueId;
        this.serviceRequestIds = serviceRequestIds;
        this.priority = priority;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    addServiceRequest(serviceRequestId: string) {
        this.serviceRequestIds.push(serviceRequestId);
        this.updatedAt = new Date();
    }

    removeServiceRequest(serviceRequestId: string) {
        this.serviceRequestIds = this.serviceRequestIds.filter(id => id !== serviceRequestId);
        this.updatedAt = new Date();
    }
}