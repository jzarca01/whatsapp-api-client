'use strict';

var axios = require('axios');
var fs = require('fs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () {
                        return e[k];
                    }
                });
            }
        });
    }
    n['default'] = e;
    return Object.freeze(n);
}

var axios__default = /*#__PURE__*/_interopDefaultLegacy(axios);
var fs__namespace = /*#__PURE__*/_interopNamespace(fs);

class CommonUtils {
    static validateString (name, val) {
        if (!val || Object.prototype.toString.call(val) !== '[object String]')
            throw new Error(`${name} must be a String!`)
    }
    static validateInteger(name, val) {
        if(!Number.isInteger(val)) 
            throw new Error(`${name} must be an integer!`)
    }

    static validateNumber(name, val) {
        if(!val || !Number(val)) 
            throw new Error(`${name} must be a number!`)
    }

    static validateObject (name, val) {
        if(!val || Object.prototype.toString.call(val) !== '[object Object]') 
            throw new Error(`${name} must be an Object!`)
    }

    static generateMethodURL(params, method, messageId) {
        return `${params.host}/waInstance${params.idInstance}/${method}/${params.apiTokenInstance}`
    }

    static validateChatIdPhoneNumber(chatId, phoneNumber) {
        if (!chatId) {
            CommonUtils.validateInteger('phoneNumber', phoneNumber);
        }
        if (!phoneNumber) {
            CommonUtils.validateString('chatId', chatId);
        }
    }

    static validateArray(name, val) {
        if (!val || !Array.isArray(val))
            throw new Error(`${name} must be an Array!`)
    }

    static validatePath (name, val) {
        if (!val || !fs__namespace.existsSync(val))
            throw new Error(`${name} not found!`)
    }
}

class MessageAPI {

    constructor(restAPI) {
        this._restAPI = restAPI;
    }
    /** Send text message to chat or phone. Method call adds message to sending queue
     * 
     * @param {String} chatId - chat id using Whatsapp format (17633123456@c.us - for private messages). 
     *  Mandatory if phoneNumber is empty
     * @param {Number} phoneNumber - receiver phone number using international format whithout + sign.
     * Mandatory if chatId is empty
     * @param {String} message - text message
     */
    async sendMessage (chatId, phoneNumber, message) {
        CommonUtils.validateChatIdPhoneNumber(chatId, phoneNumber);
        CommonUtils.validateString('message', message);

        const method = 'sendMessage';
        
        const postData = {
            'message': message,
        };

        this.addChadIdParam(postData, chatId);
        this.addPhoneParam(postData, phoneNumber);

        const response = await axios__default['default'].post(CommonUtils.generateMethodURL(this._restAPI.params, method), postData);
        return response.data
    }

    /**
     * 
     * @param {String} chatId 
     * @param {Number} phoneNumber 
     * @param {String} nameLocation 
     * @param {String} address 
     * @param {Number} latitude 
     * @param {Number} longitude 
     */
    async sendLocation (chatId, phoneNumber, nameLocation, address, latitude, longitude) {
        CommonUtils.validateChatIdPhoneNumber(chatId, phoneNumber);
        CommonUtils.validateString('nameLocation', nameLocation);
        CommonUtils.validateString('address', address);
        CommonUtils.validateNumber('latitude', latitude);
        CommonUtils.validateNumber('longitude', longitude);

        const method = 'sendLocation';

        const postData = {
            'nameLocation': nameLocation,
            'address': address,
            'latitude': latitude,
            'longitude': longitude,
        };

        this.addChadIdParam(postData, chatId);
        this.addPhoneParam(postData, phoneNumber);

        const response = await axios__default['default'].post(CommonUtils.generateMethodURL(this._restAPI.params, method), postData);
        return response.data
    }

    /**
     * 
     * @param {String} chatId 
     * @param {Number} phoneNumber 
     * @param {Object} contact - object with one or more fields
     */
    async sendContact (chatId, phoneNumber, contact) {
        CommonUtils.validateChatIdPhoneNumber(chatId, phoneNumber);
        CommonUtils.validateObject('contact', contact);

        const method = 'sendContact';

        const postData = {
            'contact': contact,
        };

        this.addChadIdParam(postData, chatId);
        this.addPhoneParam(postData, phoneNumber);

        const response = await axios__default['default'].post(CommonUtils.generateMethodURL(this._restAPI.params, method), postData);
        return response.data
    }

    /**
     * 
     * @param {String} chatId 
     * @param {Number} phoneNumber 
     * @param {String} urlLink
     */
    async sendLink (chatId, phoneNumber, urlLink) {
        CommonUtils.validateChatIdPhoneNumber(chatId, phoneNumber);
        CommonUtils.validateString('urlLink', urlLink);

        const method = 'sendLink';

        const postData = {
            'urlLink': urlLink,
        };

        this.addChadIdParam(postData, chatId);
        this.addPhoneParam(postData, phoneNumber);

        const response = await axios__default['default'].post(CommonUtils.generateMethodURL(this._restAPI.params, method), postData);
        return response.data
    }

    /**
     * 
     * @param {String} chatId 
     * @param {Number} phoneNumber 
     * @param {String} idMessage 
     */
    async readChat (chatId, phoneNumber, idMessage = null) {
        CommonUtils.validateChatIdPhoneNumber(chatId, phoneNumber);

        const method = 'readChat';

        const postData = {
            'idMessage': idMessage ,
        };

        this.addChadIdParam(postData, chatId);
        this.addPhoneParam(postData, phoneNumber);

        const response = await axios__default['default'].post(CommonUtils.generateMethodURL(this._restAPI.params, method), postData);
        return response.data
    }

      /**
     * Returns array of QueueMessage objects
     */
    async showMessagesQueue() {
        const method = 'showMessagesQueue';
        const response = await axios__default['default'].get(CommonUtils.generateMethodURL(this._restAPI.params, method));
        return response.data.map((msg) => new QueueMessage(msg))
    }

    async clearMessagesQueue() {
        const method = 'clearMessagesQueue';
        const response = await axios__default['default'].get(CommonUtils.generateMethodURL(this._restAPI.params, method));
        return response.data
    }

    /**
     * Returns array of Message objects
     */
    async lastIncomingMessages() {
        const method = 'lastIncomingMessages';
        const response = await axios__default['default'].get(CommonUtils.generateMethodURL(this._restAPI.params, method));
        return response.data.map((msg) => new Message(msg))
    }

    /**
     * Returns array of Message objects
     */
    async lastOutgoingMessages() {
        const method = 'lastOutgoingMessages';
        const response = await axios__default['default'].get(CommonUtils.generateMethodURL(this._restAPI.params, method));
        return response.data.map((msg) => new Message(msg))
    }

    addChadIdParam(postData, chatId) {
        if (chatId) {
            postData.chatId = chatId;
        } 
    }

    addPhoneParam(postData, phoneNumber) {
        if (phoneNumber) {
            postData.phoneNumber = phoneNumber;
        }
    }
}

class Message {
    constructor(data) {
        this.chatId = data.chatId;
        this.idMessage = data.idMessage;
        this.statusMessage = data.statusMessage;
        this.textMessage = data.textMessage;
        this.timestamp = data.timestamp;
        this.typeMessage = data.typeMessage;
    }
}

class QueueMessage {
    constructor(data) {
        this.chatId = data.chatId;
        this.fileName = data.fileName;
        this.typeMessage = data.typeMessage;
    }
}

class FileAPI {

    constructor(restAPI) {
        this._restAPI = restAPI;
    }
    /**
     * 
     * @param {String} chatId 
     * @param {Number} phoneNumber 
     * @param {String} urlFile 
     * @param {String} fileName 
     * @param {String} caption Optional
     */
    async sendFileByUrl(chatId, phoneNumber, urlFile, fileName, caption = '') {
        CommonUtils.validateChatIdPhoneNumber(chatId, phoneNumber);
        CommonUtils.validateString('urlFile', urlFile);
        CommonUtils.validateString('filename', fileName);

        const method = 'sendFileByUrl';
        const postData = {
            'urlFile': urlFile,
            'fileName': fileName,
            'caption': caption,
        };

        this.addChadIdParam(postData, chatId);
        this.addPhoneParam(postData, phoneNumber);

        const response = await axios__default['default'].post(CommonUtils.generateMethodURL(this._restAPI.params, method), postData);
        return response.data;
    }
    /**
     * 
     * @param {FormData} formData 
     */
    async sendFileByUpload(formData) {
        const method = 'sendFileByUpload';
        const response = await axios__default['default']({
            method: 'post',
            url: CommonUtils.generateMethodURL(this._restAPI.params, method),
            data: formData,
            ... formData.getHeaders()
        });
        return response.data; 
    }
    /**
     * 
     * @param {String} messageId 
     */
    async downloadFile(messageId) {
        CommonUtils.validateString('messageId', messageId);

        const method = 'downloadFile';
        const url = `${this._restAPI.params.host}/waInstance${this._restAPI.params.idInstance}/${method}/${messageId}`;
        const response = await axios__default['default'].get(url);
        return response.data;
    }

    addChadIdParam(postData, chatId) {
        if (chatId) {
            postData.chatId = chatId;
        } 
    }

    addPhoneParam(postData, phoneNumber) {
        if (phoneNumber) {
            postData.phoneNumber = phoneNumber;
        }
    }
}

class InstanceAPI {

    constructor(restAPI) {
        this._restAPI = restAPI;
    }

    async qr() {
        const method = 'qr';
        const response = await axios__default['default'].get(CommonUtils.generateMethodURL(this._restAPI.params, method));
        return response.data
    }

    async logout() {
        const method = 'logout';
        const response = await axios__default['default'].get(CommonUtils.generateMethodURL(this._restAPI.params, method));
        return response.data
    }

    async reboot() {
        const method = 'reboot';
        const response = await axios__default['default'].get(CommonUtils.generateMethodURL(this._restAPI.params, method));
        return response.data
    }

    async getStateInstance() {
        const method = 'getStateInstance';
        const response = await axios__default['default'].get(CommonUtils.generateMethodURL(this._restAPI.params, method));
        return response.data
    }

    async getDeviceInfo() {
        const method = 'getDeviceInfo';
        const response = await axios__default['default'].get(CommonUtils.generateMethodURL(this._restAPI.params, method));
        return response.data
    }

    /**
     * 
     * @param {Number} phoneNumber 
     */
    async checkWhatsapp(phoneNumber) {
        CommonUtils.validateInteger('phoneNumber', phoneNumber);

        const method = 'checkWhatsapp';
        const postData = {
            'phoneNumber': phoneNumber,
        };
        const response = await axios__default['default'].post(CommonUtils.generateMethodURL(this._restAPI.params, method), postData);
        return response.data
    }

    /**
     * 
     * @param {String} chatId 
     * @param {Number} phoneNumber 
     */
    async getAvatar(chatId, phoneNumber) {
        CommonUtils.validateChatIdPhoneNumber(chatId, phoneNumber);

        const method = 'getAvatar';
        const postData = {
        };

        this.addChadIdParam(postData, chatId);
        this.addPhoneParam(postData, phoneNumber);

        const response = await axios__default['default'].post(CommonUtils.generateMethodURL(this._restAPI.params, method), postData);
        return response.data
    }

    async getContacts() {
        const method = 'getContacts';
        const response = await axios__default['default'].get(CommonUtils.generateMethodURL(this._restAPI.params, method));
        return response.data
    }

    addChadIdParam(postData, chatId) {
        if (chatId) {
            postData.chatId = chatId;
        } 
    }

    addPhoneParam(postData, phoneNumber) {
        if (phoneNumber) {
            postData.phoneNumber = phoneNumber;
        }
    }

}

class SettingsAPI {

    constructor(restAPI) {
        this._restAPI = restAPI;
    }

    async getSettings() {
        const method = 'getSettings';
        const response = await axios__default['default'].get(CommonUtils.generateMethodURL(this._restAPI.params, method));
        return response.data;
    }

    /**
     * Change instance account settings. You can specify which settings to update. 
     * Instance will be restarted as a result of method.
     *
     * @param {Object} settings - js object that consists of one or more props:
     * countryInstance, webhookUrl, delaySendMessagesMilliseconds, markIncomingMessagesReaded,
     * for example:
     * 
     * settings = {
     *   countryInstance: "ru",
     *   delaySendMessagesMilliseconds: 500
     * }
     * 
     */
    async setSettings(settings) {
        CommonUtils.validateObject("settings", settings);
        
        const method = 'setSettings';
        const postData = settings;
        const response = await axios__default['default'].post(CommonUtils.generateMethodURL(this._restAPI.params, method), postData);
        return response.data;
    }


}

class GroupAPI {

    constructor(restAPI) {
        this._restAPI = restAPI;
    }
    /**
     * 
     * @param {String} groupName 
     * @param {Array} chatIds 
     * @param {Array} phones 
     */
    async createGroup(groupName, chatIds, phones) {
        CommonUtils.validateString('groupName', groupName);
        CommonUtils.validateArray('chatIds', chatIds);
        CommonUtils.validateArray('phones', phones);

        const method = 'createGroup';
        const postData = {
            'groupName': groupName,
            'chatIds': chatIds,
            'phones': phones,
        };
        const response = await axios__default['default'].post(CommonUtils.generateMethodURL(this._restAPI.params, method), postData);
        return response.data;
    }

    /**
     * 
     * @param {String} groupId 
     * @param {String} participantChatId 
     * @param {Number} participantPhone 
     */
    async addGroupParticipant(groupId, participantChatId, participantPhone) {
        CommonUtils.validateString('groupId', groupId);
        CommonUtils.validateChatIdPhoneNumber(participantChatId, participantPhone);

        const method = 'addGroupParticipant';
        const postData = {
            'groupId': groupId,
            'participantChatId': participantChatId,
            'participantPhone': participantPhone,
        };
        const response = await axios__default['default'].post(CommonUtils.generateMethodURL(this._restAPI.params, method), postData);
        return response.data;
    }

    /**
     * 
     * @param {String} groupId 
     */
    async getGroupData(groupId) {
        CommonUtils.validateString('groupId', groupId);

        const method = 'getGroupData';
        const postData = {
            'groupId': groupId,
        };
        const response = await axios__default['default'].post(CommonUtils.generateMethodURL(this._restAPI.params, method), postData);
        return response.data;
    }

    /**
     * 
     * @param {String} groupId 
     * @param {String} participantChatId 
     * @param {Number} participantPhone 
     */
    async removeGroupParticipant(groupId, participantChatId, participantPhone) {
        CommonUtils.validateString('groupId', groupId);
        CommonUtils.validateChatIdPhoneNumber(participantChatId, participantPhone);

        const method = 'removeGroupParticipant';
        const postData = {
            'groupId': groupId,
            'participantChatId': participantChatId,
            'participantPhone': participantPhone,
        };
        const response = await axios__default['default'].post(CommonUtils.generateMethodURL(this._restAPI.params, method), postData);
        return response.data;
    }

    /**
     * 
     * @param {String} groupId 
     * @param {String} groupName 
     */
    async updateGroupName(groupId, groupName) {
        CommonUtils.validateString('groupId', groupId);
        CommonUtils.validateString('groupName', groupName);

        const method = 'updateGroupName';
        const postData = {
            'groupId': groupId,
            'groupName': groupName,
        };
        const response = await axios__default['default'].post(CommonUtils.generateMethodURL(this._restAPI.params, method), postData);
        return response.data;
    }

    /**
     * 
     * @param {String} groupId 
     * @param {String} participantChatId 
     * @param {Number} participantPhone 
     */
    async setGroupAdmin(groupId, participantChatId, participantPhone) {
        CommonUtils.validateString('groupId', groupId);

        const method = 'setGroupAdmin';
        const postData = {
            'groupId': groupId,
            'participantChatId': participantChatId,
            'participantPhone': participantPhone,
        };
        const response = await axios__default['default'].post(CommonUtils.generateMethodURL(this._restAPI.params, method), postData);
        return response.data;
    }

    /**
     * 
     * @param {String} groupId 
     * @param {String} participantChatId 
     * @param {Number} participantPhone 
     */
    async removeAdmin(groupId, participantChatId, participantPhone) {
        CommonUtils.validateString('groupId', groupId);

        const method = 'removeAdmin';
        const postData = {
            'groupId': groupId,
            'participantChatId': participantChatId,
            'participantPhone': participantPhone,
        };
        const response = await axios__default['default'].post(CommonUtils.generateMethodURL(this._restAPI.params, method), postData);
        return response.data;
    }

    /**
     * 
     * @param {String} groupId 
     */
    async leaveGroup(groupId) {
        CommonUtils.validateString('groupId', groupId);

        const method = 'removeAdmin';
        const postData = {
            'groupId': groupId,
        };
        const response = await axios__default['default'].post(CommonUtils.generateMethodURL(this._restAPI.params, method), postData);
        return response.data;
    }

}

class SingleThreadJobScheduler {

    initJobs(jobs = []) {
        this.jobs = jobs;
    }

    reschedule() {
        this.jobs.forEach(job => {
            job.needInterrupt = false;
            clearInterval(job.timerId);
            job.timerId = setInterval(job.run, job.intervalSec * 1000);
        });
    }    
    
    unschedule() {
        this.jobs.forEach(job => {
            job.needInterrupt = true;
            clearInterval(job.timerId);
        });
    }
}

class ReceiveNotificationsJob {

    timerId;
    intervalSec; 
    needInterrupt = false

    constructor(webhookServiceApi) {
        this.webhookServiceApi = webhookServiceApi;
        this.intervalSec = Number.parseInt('1'); 
    }
    
    run = async () => {
        clearInterval(this.timerId);
        try {
            let response;
            while (response = await this.webhookServiceApi.receiveNotification()) {
                let webhookBody = response.body;
                if (webhookBody.typeWebhook === this.webhookServiceApi.noteTypes.incomingMessageReceived) {
                    if (webhookBody.messageData.typeMessage == "imageMessage") {
                        this.callCallback(this.webhookServiceApi.callbackTypes.onReceivingMessageImage, webhookBody);
                    } else if (webhookBody.messageData.typeMessage == "videoMessage") {
                        this.callCallback(this.webhookServiceApi.callbackTypes.onReceivingMessageVideo, webhookBody);
                    } else if (webhookBody.messageData.typeMessage == "documentMessage") {
                        this.callCallback(this.webhookServiceApi.callbackTypes.onReceivingMessageDocument, webhookBody);
                    } else if (webhookBody.messageData.typeMessage == "audioMessage") {
                        this.callCallback(this.webhookServiceApi.callbackTypes.onReceivingMessageAudio, webhookBody);
                    } else if (webhookBody.messageData.typeMessage == "documentMessage") {
                        this.callCallback(this.webhookServiceApi.callbackTypes.onReceivingMessageDocument, webhookBody);
                    } else if (webhookBody.messageData.typeMessage == "textMessage") {
                        this.callCallback(this.webhookServiceApi.callbackTypes.onReceivingMessageText, webhookBody);
                    } else if (webhookBody.messageData.typeMessage == "extendedTextMessage") {
                        this.callCallback(this.webhookServiceApi.callbackTypes.onReceivingMessageTextURL, webhookBody);
                    } else if (webhookBody.messageData.typeMessage == "contactMessage") {
                        this.callCallback(this.webhookServiceApi.callbackTypes.onReceivingMessageContact, webhookBody);
                    } else if (webhookBody.messageData.typeMessage == "locationMessage") {
                        this.callCallback(this.webhookServiceApi.callbackTypes.onReceivingMessageLocation, webhookBody);
                    }
                } else if (webhookBody.typeWebhook === this.webhookServiceApi.noteTypes.stateInstanceChanged) { 
                    this.callCallback(this.webhookServiceApi.callbackTypes.onReceivingAccountStatus, webhookBody);
                } else if (webhookBody.typeWebhook === this.webhookServiceApi.noteTypes.outgoingMessageStatus) { 
                    this.callCallback(this.webhookServiceApi.callbackTypes.onReceivingOutboundMessageStatus, webhookBody);
                } else if (webhookBody.typeWebhook === this.webhookServiceApi.noteTypes.deviceInfo) { 
                    this.callCallback(this.webhookServiceApi.callbackTypes.onReceivingDeviceStatus, webhookBody);
                }
                await this.webhookServiceApi.deleteNotification(response.receiptId);
            }
        } catch (ex) {
            console.error(ex.toString());
        }
        if (!this.needInterrupt) {
            this.timerId = setInterval(this.run, this.intervalSec * 1000);
        }
    }

    callCallback(webhookType, body) {
        const callback = this.webhookServiceApi._callbacks.get(webhookType);
        if (callback) {
            // Found webhook callback;
            callback.call(this, body);
            // Callback invoked successfully;
        }    }
    
}

class WebhookServiceAPI {

    constructor(restAPI) {
        this._restAPI = restAPI;
        this._jobScheduler = new SingleThreadJobScheduler();
        this.noteTypes = {
            incomingMessageReceived : 'incomingMessageReceived',
            outgoingMessageStatus : 'outgoingMessageStatus',
            stateInstanceChanged : 'stateInstanceChanged',
            deviceInfo: 'deviceInfo',
        };
        this.callbackTypes = {
            onReceivingMessageText : 'onReceivingMessageText',
            onReceivingMessageImage : 'onReceivingMessageImage',
            onReceivingMessageVideo : 'onReceivingMessageVideo',
            onReceivingMessageDocument: 'onReceivingMessageDocument',
            onReceivingMessageAudio: 'onReceivingMessageAudio',
            onReceivingOutboundMessageStatus: 'onReceivingOutboundMessageStatus',
            onReceivingAccountStatus: 'onReceivingAccountStatus',
            onReceivingDeviceStatus: 'onReceivingDeviceStatus',
            onReceivingMessageTextURL: 'onReceivingMessageTextURL',
            onReceivingMessageContact: 'onReceivingMessageContact',
            onReceivingMessageLocation: 'onReceivingMessageLocation',
        };
        this._callbacks = new Map();
    }

    async receiveNotification() {
        const method = 'receiveNotification';
        const response = await axios__default['default'].get(CommonUtils.generateMethodURL(this._restAPI.params, method));
        return response.data
    }

    /**
     * 
     * @param {Number} receiptId 
     */
    async deleteNotification(receiptId) {
        CommonUtils.validateInteger('receiptId', receiptId);

        const method = 'deleteNotification';
        const response = await axios__default['default'].delete(`${CommonUtils.generateMethodURL(this._restAPI.params, method)}/${receiptId}`);
        return response.data
    }

    async startReceivingNotifications() {
        this._jobScheduler.initJobs([new ReceiveNotificationsJob(this)]);
        this._jobScheduler.reschedule();
    }

    async stopReceivingNotifications() {
        this._jobScheduler.unschedule();
    }

    onReceivingMessageText(callback)
    {
        this._callbacks.set(this.callbackTypes.onReceivingMessageText, callback);
    }
    onReceivingMessageImage(callback)
    {
        this._callbacks.set(this.callbackTypes.onReceivingMessageImage, callback);
    }
    onReceivingMessageVideo(callback)
    {
        this._callbacks.set(this.callbackTypes.onReceivingMessageVideo, callback);
    }
    onReceivingMessageDocument(callback)
    {
        this._callbacks.set(this.callbackTypes.onReceivingMessageDocument, callback);
    }
    onReceivingMessageAudio(callback)
    {
        this._callbacks.set(this.callbackTypes.onReceivingMessageAudio, callback);
    }
    onReceivingOutboundMessageStatus(callback)
    {
        this._callbacks.set(this.callbackTypes.onReceivingOutboundMessageStatus, callback);
    }
    onReceivingAccountStatus(callback)
    {
        this._callbacks.set(this.callbackTypes.onReceivingAccountStatus, callback);
    }
    onReceivingDeviceStatus(callback)
    {
        this._callbacks.set(this.callbackTypes.onReceivingDeviceStatus, callback);
    }
    onReceivingMessageTextURL(callback)
    {
        this._callbacks.set(this.callbackTypes.onReceivingMessageTextURL, callback);
    }
    onReceivingMessageContact(callback)
    {
        this._callbacks.set(this.callbackTypes.onReceivingMessageContact, callback);
    }
    onReceivingMessageLocation(callback)
    {
        this._callbacks.set(this.callbackTypes.onReceivingMessageLocation, callback);
    }
}

class RestAPI {

    constructor (params) {
        
        this.params = {
            host: '',
            idInstance: '',
            apiTokenInstance: '',
            credentialsPath: null,
        };

        Object.assign(this.params, params);

        if (params.credentialsPath) {
            fs__namespace.readFileSync(params.credentialsPath)
            .toString('utf8')
            .split('\n')
            .map(item => item.split(" ").join("")) // replaceAll equivualent
            .forEach(item => {
                if (item.startsWith('API_TOKEN_INSTANCE=')) {
                    this.params.apiTokenInstance = item.replace('API_TOKEN_INSTANCE=', '').trim();
                } else if (item.startsWith('ID_INSTANCE=')) {
                    this.params.idInstance = item.replace('ID_INSTANCE=', '').trim();
                }
            });
        }

        this.message = new MessageAPI(this);
        this.file = new FileAPI(this);
        this.instance = new InstanceAPI(this);
        this.settings = new SettingsAPI(this);
        this.group = new GroupAPI(this);
        this.webhookService = new WebhookServiceAPI(this);
    }
}

var configuration = {
    defaultHost: "https://api.green-api.com"
};

class WebhooksCallbackAPI  {

    constructor(express, webhookRoutePath) {
        this._app = express;
        this._webhookRoutePath = webhookRoutePath;
        this._callbacks = new Map();
    }

    init() {
        this._app.post(this._webhookRoutePath, async (req, res, next) => {
            try {
                console.log(`Received webhook ${req.body.typeWebhook}`);
                let webhookType = null;
                if (req.body.messageData && req.body.messageData.typeMessage) {
                    webhookType = `${req.body.typeWebhook}_${req.body.messageData.typeMessage}`;
                } else {
                    webhookType = req.body.typeWebhook;
                }

                const callback = this._callbacks.get(webhookType);
                if (callback) {
                    // Found webhook callback;
                    callback.call(this, req.body);
                    // Callback invoked successfully;
                } else {
                    // Callback not found;
                };
                return res.send();
            } catch (err) {
                next(err); 
            }
        });
    }
    
    /**
     * 
     * @param {Function} callback function 
     */
    onStateInstance(callback) {
        this._callbacks.set("stateInstanceChanged", callback);
    }

    /**
     * 
     * @param {Function} callback function 
     */
    onOutgoingMessageStatus(callback) {
        this._callbacks.set("outgoingMessageStatus", (data) => {
            callback.call(this, data, data.instanceData.idInstance, data.idMessage, data.status);
        });
    }

    /**
     * 
     * @param {Function} callback function
     */
    onIncomingMessageText(callback) {
        this._callbacks.set("incomingMessageReceived_textMessage", (data) => {
            callback.call(this, data, data.instanceData.idInstance, data.idMessage, data.senderData.sender, data.messageData.typeMessage, 
                data.messageData.textMessageData.textMessage);
        });
    }

    /**
     * 
     * @param {Function} callback function 
     */
    onIncomingMessageFile(callback) {
        this._callbacks.set("incomingMessageReceived_imageMessage", (data) => {
            callback.call(this, data, data.instanceData.idInstance, data.idMessage, data.senderData.sender, data.messageData.typeMessage, 
                data.messageData.downloadUrl);
        });
    }

    /**
     * 
     * @param {Function} callback function  
     */
    onIncomingMessageLocation(callback) {
        this._callbacks.set("incomingMessageReceived_locationMessage", (data) => {
            callback.call(this, data, data.instanceData.idInstance, data.idMessage, data.senderData.sender, data.messageData.typeMessage, 
                data.messageData.locationMessageData.latitude, data.messageData.locationMessageData.longitude, data.messageData.locationMessageData.jpegThumbnail);
        });
    }

    /**
     * 
     * @param {Function} callback function  
     */
    onIncomingMessageContact(callback) {
        this._callbacks.set("incomingMessageReceived_contactMessage", (data) => {
            callback.call(this, data, data.instanceData.idInstance, data.idMessage, data.senderData.sender, data.messageData.typeMessage, 
                data.messageData.contactMessageData.displayName, data.messageData.contactMessageData.vcard);
        });
    }

    /**
     * 
     * @param {Function} callback function  
     */
    onIncomingMessageExtendedText(callback) {
        this._callbacks.set("incomingMessageReceived_extendedTextMessage", (data) => {
            callback.call(this, data, data.instanceData.idInstance, data.idMessage, data.senderData.sender, data.messageData.typeMessage, 
                data.extendedTextMessageData);
        });
    }

    /**
     * 
     * @param {Function} callback function 
     */
    onDeviceInfo(callback) {
        this._callbacks.set("deviceInfo", callback);
    }

}

function checkInitParams(params = {}) {

    if (params.host) {
        CommonUtils.validateString("host", params.host);
    } else {
        params.host = configuration.defaultHost;
    }
    if (params.credentialsPath) {
        CommonUtils.validatePath("credentialsPath", params.credentialsPath);
    } else {
        CommonUtils.validateString("idInstance", params.idInstance);
        CommonUtils.validateString("apiTokenInstance", params.apiTokenInstance);
    }
    
}

const restAPI = (params = {}) => {
    checkInitParams(params);
    return new RestAPI(params)
};

const webhookAPI = (express, webhookRoutePath) => {
    const api = new WebhooksCallbackAPI(express, webhookRoutePath);
    api.init();
    return api;
};

var index = {
    restAPI,
    webhookAPI
};

module.exports = index;
