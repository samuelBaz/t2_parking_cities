export function clonacionProfunda<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    let arrCopy: any[] = [];
    for (let i = 0; i < obj.length; i++) {
      arrCopy[i] = clonacionProfunda(obj[i]);
    }
    return arrCopy as unknown as T;
  }

  let objCopy: { [key: string]: any } = {};
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      objCopy[key] = clonacionProfunda((obj as { [key: string]: any })[key]);
    }
  }
  return objCopy as T;
}