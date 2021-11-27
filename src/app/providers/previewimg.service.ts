import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {APIService} from './api.service';


@Injectable({
    providedIn: 'root'
})
export class PreviewimgService {

    constructor() {
    }

    getReader(resolve, reject) {
        const reader = new FileReader();
        reader.onload = this.Onload(reader, resolve);
        reader.onerror = this.OnError(reader, reject);
        return reader;
    }

    readAsText(file) {
        const that = this;
        return new Promise((resolve, reject) => {
            const reader = that.getReader(resolve, reject);
            reader.readAsText(file, 'utf8');
        });
    }

    readAsDataUrl(file) {
        const that = this;
        return new Promise((resolve, reject) => {
            const reader = that.getReader(resolve, reject);
            reader.readAsDataURL(file);
        });
    }

    readAsArrayBuffer(blob) {
        const that = this;
        return new Promise( (resolve, reject) => {
            const reader = that.getReader(resolve, reject);
            reader.readAsArrayBuffer(blob);
        });
    }

    Onload(reader: FileReader, resolve) {
        return () => {
            resolve(reader.result);
        };
    }

    OnError(reader: FileReader, reject) {
        return () => {
            reject(reader.result);
        };
    }


    // base64格式是：data:image/jpeg;base64,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
    base64ToFile(base64, filename = 'file') {
        const arr = base64.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const suffix = mime.split('/')[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], `${filename}.${suffix}`, {
            type: mime
        });
    }

    filesToBase64s(files: Array<File>): Observable<any> {
        return new Observable(observer => {
            const base64List = [];
            for (const one of files) {
                this.readAsDataUrl(one).then(value => {
                    base64List.push(value);
                });
            }
            observer.next(base64List);
        });
    }

    readAsDataUrlWithCompress(file, w, outputFormat = 'image/jpeg') {
        const that = this;
        return new Promise( (resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            let quality = 0.8; // 压缩系数0-1之间
            let imgWidth;
            let imgHeight;
            that.readAsDataUrl(file).then(base64 => {
                img.src = base64.toString();
                img.onload = () => {
                    imgWidth = img.width;
                    imgHeight = img.height;
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    if (Math.max(imgWidth, imgHeight) > w) {
                        if (imgWidth > imgHeight) {
                            canvas.width = w;
                            canvas.height = w * imgHeight / imgWidth;
                        } else {
                            canvas.height = w;
                            canvas.width = w * imgWidth / imgHeight;
                        }
                    } else {
                        canvas.width = imgWidth;
                        canvas.height = imgHeight;
                        quality = 0.6;
                    }
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const imgBase64 = canvas.toDataURL(outputFormat, quality);
                    // 如想确保图片压缩到自己想要的尺寸,如要求在50-150kb之间，请加以下语句，quality初始值根据情况自定
                    // while (base64.length / 1024 > 150) {
                    // 	quality -= 0.01;
                    // 	base64 = canvas.toDataURL("image/jpeg", quality);
                    // }
                    // 防止最后一次压缩低于最低尺寸，只要quality递减合理，无需考虑
                    // while (base64.length / 1024 < 50) {
                    // 	quality += 0.001;
                    // 	base64 = canvas.toDataURL("image/jpeg", quality);
                    // }
                    resolve(imgBase64);
                };
            });
        });
    }


    readAsDataUrlByFilePath(filePath, w, outputFormat = 'image/jpeg') {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            let quality = 0.8; // 压缩系数0-1之间
            let imgWidth;
            let imgHeight;
            img.src = filePath;
            img.onload = () => {
                imgWidth = img.width;
                imgHeight = img.height;
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (Math.max(imgWidth, imgHeight) > w) {
                    if (imgWidth > imgHeight) {
                        canvas.width = w;
                        canvas.height = w * imgHeight / imgWidth;
                    } else {
                        canvas.height = w;
                        canvas.width = w * imgWidth / imgHeight;
                    }
                } else {
                    canvas.width = imgWidth;
                    canvas.height = imgHeight;
                    quality = 0.6;
                }
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const imgBase64 = canvas.toDataURL(outputFormat, quality);
                // 如想确保图片压缩到自己想要的尺寸,如要求在50-150kb之间，请加以下语句，quality初始值根据情况自定
                // while (base64.length / 1024 > 150) {
                // 	quality -= 0.01;
                // 	base64 = canvas.toDataURL("image/jpeg", quality);
                // }
                // 防止最后一次压缩低于最低尺寸，只要quality递减合理，无需考虑
                // while (base64.length / 1024 < 50) {
                // 	quality += 0.001;
                // 	base64 = canvas.toDataURL("image/jpeg", quality);
                // }
                resolve(imgBase64);
            };
        });
    }
}
