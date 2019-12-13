import * as camelCase from "camelCase";

export class Helper{
    static stringConstructor = ''.constructor;
	static arrayConstructor = [].constructor;
	static objectConstructor = {}.constructor;
	static numberConstructor = (0).constructor;
	static dateConstructor = new Date().constructor;
    static isVoid(obj) {
		switch (typeof obj) {
			case 'undefined':
				return true;
			case 'object':
				for (const x in obj) {
					if (obj.hasOwnProperty(x)) {
						return false;
					}
					return true;
				}
				return true;
			case 'number':
			case 'boolean':
				return false;
			case 'string':
				if (obj === '' || obj === 'null' || obj === 'undefined') {
					return true;
				}
				return false;
			/* falls through */
			default:
				return false;
		}
    }
    
    static convertToCamelCaseObject(data: any) {
		let newData: any;
		let origKey: string;
		let newKey: string;
		let value: any;
		if (data instanceof Array) {
			return data.map((value) => {
				if (typeof value === 'object') {
					value = this.convertToCamelCaseObject(value);
				}
				return value;
			});
		}
		newData = {};
		for (origKey in data) {
			if (data.hasOwnProperty(origKey)) {
				newKey = camelCase(origKey);
				value = data[origKey];
				if (value instanceof Array || (!this.isVoid(value) && typeof value === 'object' && Helper.whatIsIt(value) !== 'Date')) {
					value = this.convertToCamelCaseObject(value);
				}
				newData[newKey] = value;
			}
		}
		return newData;
    }
    static whatIsIt(object) {
		if (object === null) {
			return 'null';
		}
		if (object === undefined) {
			return 'undefined';
		}
		if (object.constructor === this.stringConstructor) {
			return 'String';
		}
		if (object.constructor === this.arrayConstructor) {
			return 'Array';
		}
		if (object.constructor === this.objectConstructor || typeof object === 'object') {
			return 'Object';
		}
		if (object.constructor === this.numberConstructor) {
			return 'Number';
		}
		if (object.constructor === this.dateConstructor) {
			return 'Date';
		}
		return 'Other';
    }
    static getInStr(length: number, startingPos: number = 1) {
		const paramInStrArr: any = [];
		for (let i = 0; i < length; i = i + 1) {
			paramInStrArr.push(`$${i + startingPos}`);
		}
		const paramsInStr = `(${paramInStrArr.join(',')})`;
		return paramsInStr;
	}
}