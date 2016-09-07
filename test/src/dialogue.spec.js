'use strict';

const Dialogue = require('../../src/dialogue').Dialogue;
const expect = require('chai').expect;

describe.only('Basic keyword parsing', () => {

  const mockConfig = {
    'thieves guild': {
      keywords: ['thieves', 'thief', 'stealing', 'guild'],
      priority: 2,
      prereqs: {
        introduced: true
      },
      dialogue: 'I need you to infiltrate the thieves guild for me, and find their roster.'
    },
    'murder': {
      keywords: ['murder', 'killings', 'assassin', 'assassination'],
      priority: 4,
      prereqs: {
        introduced: true
      },
      dialogue: 'The thieves have become assassins? We cannot have two assassin\'s guilds...'
    }
  };

  describe('tokenization', () => {
    it('should be able to break a string into words', () => {
      expect(Dialogue.tokenizeSentence('hello world!')).to.eql(['hello', 'world']);
    });
  });

  describe('keyword finding', () => {
    it('should be true if the keyword is in the string', () => {
      expect(Dialogue.hasKeyword('thief', mockConfig['thieves guild'])).to.be.true;
    });

    it('should be false if the keyword is not in the string', () => {
      expect(Dialogue.hasKeyword('potatoes', mockConfig['thieves guild'])).to.be.false;
    });

  });

  describe('finding topics', () => {
    it('should return a list of a single topic if there is only one', () => {
      const tokens = Dialogue.tokenizeSentence('thieves guild');
      expect(Dialogue.findPotentialTopics(tokens, mockConfig).length === 1).to.be.true;
    });

    it('should return an empty array if there are no relevant topics', () => {
      const tokens = Dialogue.tokenizeSentence('pants helicopter');
      expect(Dialogue.findPotentialTopics(tokens, mockConfig).length === 0).to.be.true;
    });
  });

  describe('prioritizing dialogue', () => {
    it('should be able to pick out the highest priority topic from a list', () => {
      const tokens = Dialogue.tokenizeSentence('the thieves guild is doing a murder!');
      const topics = Dialogue.findPotentialTopics(tokens, mockConfig);

      expect(Dialogue.getPriorityTopic(topics, mockConfig)).to.eql(mockConfig['murder']);
    });
  });

});
