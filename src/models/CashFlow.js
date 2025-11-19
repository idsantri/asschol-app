import ApiCrud from './ApiCrud';

class CashFlow extends ApiCrud {
    constructor() {
        super('cash-flows');
    }

    async listAccount() {
        this.setNotifyGet();
        const response = await this.fetchAuth(`${this.path}/list-accounts`, {
            method: 'GET',
        });
        return response.data || true;
    }
}
export default new CashFlow();
