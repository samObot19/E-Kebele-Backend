export interface IQueueRepository {
    createQueue(queueData: any): Promise<any>;
    getQueueById(queueId: string): Promise<any>;
    updateQueue(queueId: string, queueData: any): Promise<any>;
    deleteQueue(queueId: string): Promise<void>;
    listQueues(): Promise<any[]>;
}