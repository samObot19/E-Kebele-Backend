export class Support {
    constructor(
        public supportId: string,
        public question: string,
        public answer: string,
        public createdAt: Date,
        public updatedAt: Date
    ) {}
}