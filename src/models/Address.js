import Api from './Api';
import ApiCrud from './ApiCrud';

class BaseAddress extends ApiCrud {
    constructor(region) {
        super('address/' + region);
    }
}

class Address extends Api {
    constructor() {
        super();
        this.defaultConfig();
        this.path = 'address';
    }

    async searchByParams(params) {
        this.setNotify({ showSuccess: false, showError: true });
        const response = await this.fetchGuest(this.path, {
            method: 'GET',
            params,
        });
        return response.data || true;
    }

    async searchKabKota(params) {
        this.setNotify({ showSuccess: false, showError: true });
        const response = await this.fetchGuest(`${this.path}/kabupaten-kota`, {
            method: 'GET',
            params,
        });
        return response.data || true;
    }
    Provinsi = new BaseAddress('provinsi');
    Kabupaten = new BaseAddress('kabupaten');
    Kecamatan = new BaseAddress('kecamatan');
    Desa = new BaseAddress('desa');
}
const address = new Address();
const { Provinsi, Kabupaten, Kecamatan, Desa } = address;
export { Provinsi, Kabupaten, Kecamatan, Desa };
export default address;
