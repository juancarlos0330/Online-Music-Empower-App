//@ts-ignore
import * as B2 from 'backblaze-b2';
import { Config } from '../common/config';

export class B2Service {
    private readonly _client: B2;

    constructor() {
        this._client = new B2({
            applicationKeyId: Config.B2_APPLICATION_KEY_ID,
            applicationKey: Config.B2_APPLICATION_KEY
        });
    }

    public async getData() {
        const authResponse = await this._client.authorize();

        let stock = '';

        const categories = {};

        let response = await this._client.listFileNames({ bucketId: Config.B2_ID, startFileName: '', delimiter: '', prefix: '', maxFileCount: 10000 });

        while(true) {
            for(const file of response.data.files.slice(1)) {
                if(!file.fileName.includes('.mp3')) continue;
    
                if(file.fileName.includes('stock files')) {
                    stock = `${authResponse.data.s3ApiUrl}/empower-hour/${file.fileName}`;
                } else if(file.fileName.includes('categories/')) {
                    const category = file.fileName.split('/')[1];
    
                    if(!categories[category]) {
                        categories[category] = []
                    }
    
                    categories[category].push(`${authResponse.data.s3ApiUrl}/empower-hour/${file.fileName}`);
                }
            }

            response = await this._client.listFileNames({ bucketId: Config.B2_ID, startFileName: response.data.files[response.data.files.length - 1].fileName, delimiter: '', prefix: '', maxFileCount: 10000 });

            if(response.data.files.length === 1) {
                break;
            }
        }

        return {
            categories,
            stock
        }
    }
}