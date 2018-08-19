const UrlBuilder = require('../../src/uri-builder/UrlBuilder.js');
const expect = require('chai').expect;
describe('URL 构建器相关', function() {
    const BASE = 'http://127.0.0.1:9200/',
        INDEX = 'index',
        TYPE = 'type';
    it('创建逻辑', function() {
        let builder = new UrlBuilder(BASE, INDEX, TYPE);
        expect(builder.buildCreateUrl({})).to.equal(BASE + INDEX + '/' + TYPE);
        expect(builder.buildCreateUrl({}, 'id')).to.equal(BASE + INDEX + '/' + TYPE + '/id');
        expect(builder.buildCreateUrl({}, 'id', { 'routing': 'routing' })).to.equal(BASE + INDEX + '/' + TYPE + '/id?routing=routing');
        let mappins = {
            'join': {
                'type': 'join'
            }
        };
        expect(() => {
            builder.buildCreateUrl(mappins, 'id')
        }).to.throw(Error);
        expect(builder.buildCreateUrl({}, 'id', {
            'parent': 'parent_id'
        })).to.equal(BASE + INDEX + '/' + TYPE + '/id?parent=parent_id')
    });

    it('更新文档逻辑', function() {
        let builder = new UrlBuilder(BASE, INDEX, TYPE);
        expect(() => { builder.buildUpdateUrl({}) }).to.throw(Error);
        expect(builder.buildUpdateUrl({}, 'id')).to.equal(BASE + INDEX + '/' + TYPE + '/id');
        expect(builder.buildUpdateUrl({}, 'id', { 'routing': 'routing' })).to.equal(BASE + INDEX + '/' + TYPE + '/id?routing=routing');
        let mappins = {
            'join': {
                'type': 'join'
            }
        };
        expect(() => {
            builder.buildUpdateUrl(mappins, 'id')
        }).to.throw(Error);
    });

    it('查询逻辑', function() {
        let builder = new UrlBuilder(BASE, INDEX, TYPE);
        expect(builder.buildQueryUrl()).to.equal(BASE + INDEX + '/' + TYPE + '/_search');
        expect(builder.buildQueryUrl({
            'scroll': '1m'
        })).to.equal(BASE + INDEX + '/' + TYPE + '/_search?scroll=1m');
    });


    it('滚动逻辑', function() {
        let builder = new UrlBuilder(BASE, INDEX, TYPE);
        expect(builder.buildScrollUrl('id')).to.equal(BASE + '_search/scroll/id?scroll=1m');
        expect(builder.buildScrollUrl('id', {
            'scroll': '5m'
        })).to.equal(BASE + '_search/scroll/id?scroll=5m');
    });
});