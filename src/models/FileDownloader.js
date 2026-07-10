import Api from './Api';
import { sanitizeFileName } from './utilities/string';

class FileDownloader extends Api {
    #downloadBlob(blob, fileName = 'dokumen.pdf') {
        const objectUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');

        anchor.href = objectUrl;
        anchor.download = sanitizeFileName(fileName);
        document.body.appendChild(anchor);

        anchor.click();
        anchor.remove();
        window.URL.revokeObjectURL(objectUrl);
    }

    async #fetchDownload(endPoint, fileName, params) {
        this.setNotify(true);
        const blob = await this.fetchFile(endPoint, fileName, params);
        return this.#downloadBlob(blob, fileName);
    }

    async downloadMember(fileName, params) {
        await this.#fetchDownload(`members/export`, fileName, { params });
    }

    async downloadIdCard(fileName, id) {
        await this.#fetchDownload(`members/${id}/id-card/download`, fileName);
    }
}

export default new FileDownloader();
