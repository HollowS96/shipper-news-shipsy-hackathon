import * as camelCase from "camelCase";

export class Helper{
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
}