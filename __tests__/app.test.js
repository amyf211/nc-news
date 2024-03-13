const db = require('../db/connection')
const app=require('../app')
const request = require('supertest')
const data=require('../db/data/test-data/index')
const seed = require('../db/seeds/seed')
const endpoints = require('../endpoints.json')

beforeEach(()=>{
    return seed(data)
  })
afterAll(()=>
  {
      return db.end()
  })
  
describe('GET /api/topics', () => {
    test('should return a status code of 200 and returns an array of topic objects with a slug and description', () => {
        return request(app)
        .get('/api/topics')
        .expect(200).then((topics) => {
            expect(Array.isArray(topics.body)).toBe(true)
            topics.body.forEach((topic) => {
                expect(topic).toMatchObject({
                    description: expect.any(String),
                    slug: expect.any(String)
                });
            })
        })
    });
  });
  
describe('GET /api', () => {
    test('should return a status code of 200', () => {
        return request(app)
        .get('/api')
        .expect(200)
        })
        test('should return an object', () => {
            return request(app)
            .get('/api')
            .expect(200).then((response) => {
                expect(typeof response).toBe('object')
            })
            });
        test('should return the contents of endpoints.json', () => {
            return request(app)
            .get('/api')
            .expect(200)
            .then((response) => {
                const actualOutput = response.body.endpoints
                expect(actualOutput).toEqual(endpoints)
            });
        });
  });

describe('GET /api/articles/:article_id', () => {
            test('should return 200 and the object that corresponds to that article id', () => {
                return request(app)
                .get('/api/articles/1')
                .expect(200).then((article) => {
                    expect(typeof article.body).toBe('object')
                    expect(article.body).toMatchObject({
                        article_id: 1,
                        title: 'Living in the shadow of a great man',
                        topic: 'mitch',
                        author: 'butter_bridge',
                        body: 'I find this existence challenging',
                        created_at: '2020-07-09T20:11:00.000Z',
                        votes: 100,
                        article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                    });
                })
            });
        test('should respond with a status code of 400 and a message when given an invalid id', () => {
            return request(app)
            .get('/api/articles/forklift')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toEqual('Bad Request')
            })
        });
        test('should respond with a status code of 404 and a message when given an valid id that is non-existent', () => {
            return request(app)
            .get('/api/articles/1000')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toEqual('Not Found')  
            })
        });
 });

describe('GET /api/articles', () => {
        test('should return a status code of 200 and returns an array of objects with the article properties', () => {
            return request(app)
            .get('/api/articles')
            .expect(200).then((articles) => {
                expect(Array.isArray(articles.body)).toBe(true)
                articles.body.forEach((article) => {
                    expect(article).toMatchObject({
                        author: expect.any(String),
                        title: expect.any(String),
                        article_id: expect.any(Number),
                        topic: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(Number)
                    });
                })
            })
        });
        test('should return 200 status code and only articles of the given topic', () => {
            return request(app)
            .get('/api/articles?topic=mitch')
            .expect(200).then((response)=>{
            const articles = response.body
    
            articles.forEach((article) => {
                expect(article.topic).toBe('mitch')
            })
            })
        });
 });

describe('GET /api/articles/:article_id/comments', () => {
        test('should return an array of comments with the correct properties and given article ID', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200).then((comments) => {
                expect(Array.isArray(comments.body)).toBe(true)
                comments.body.forEach((comment) => {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        article_id: 1
                    });
                })
            })
        });
        test('should respond with a status code of 400 and a message when given an invalid id', () => {
            return request(app)
            .get('/api/articles/forklift/comments')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toEqual('Bad Request')
            })
        });
        test('should respond with a status code of 404 and a message when given an valid id that is non-existent', () => {
            return request(app)
            .get('/api/articles/1000/comments')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toEqual('Not Found')  
            })
        });
 });

describe('GET /api/users', () => {
        test('should return 200 and an array of user objects with the correct properties', () => {
            return request(app)
            .get('/api/users')
            .expect(200).then((users) => {
                expect(Array.isArray(users.body)).toBe(true)
                users.body.forEach((user) => {
                    expect(user).toMatchObject({
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    });
                })
            })
        });
 });

describe('POST /api/articles/:article_id/comments', () => {
    test('should respond with 201 and the posted comment', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({
            username: 'butter_bridge',
            body: 'great article!'
        })
        .expect(201)
        .then((response) => {
            const newComment = response.body.newComment
            expect(newComment.author).toBe('butter_bridge')
            expect(newComment.body).toBe('great article!')
        })
    });
    test('should respond with a status code of 400 and a message when given an invalid id', () => {
        return request(app)
        .post('/api/articles/forklift/comments')
        .send({
            username: 'butter_bridge',
            body: 'great article!'
        })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toEqual('Bad Request')
        })
    });
    test('should respond with a status code of 404 and a message when given an valid id that is non-existent', () => {
        return request(app)
        .post('/api/articles/1000/comments')
        .send({
            username: 'butter_bridge',
            body: 'great article!'
        })
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toEqual('Not Found')  
        })
    });
 });

describe('DELETE /api/comments/:comment_id', () => {
    test('should respond with 204 and no content', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
    })
    test('should respond 404 and a message when given a valid but non-existent id', () => {
        return request(app)
        .delete('/api/comments/999')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Not Found')
        })
    })
    test('should return 400 and a message when given an invalid id', () => {
        return request(app)
        .delete('/api/comments/hello')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('Bad Request')
        })
    })
})

describe('PATCH /api/articles/:article_id', () => {
    test('should respond with 200 and the updated votes', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({
            inc_votes: 10
        })
        .expect(200)
        .then((response) => {
            expect(response.body.votes).toBe(110)
        });
    });

    test('should respond with a status code of 400 and a message when given an invalid id', () => {
        return request(app)
        .patch('/api/articles/forklift')
        .send({
            inc_votes: 10
        })
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toEqual('Bad Request')
        })
    });

    test('should respond with a status code of 404 and a message when given an valid id that is non-existent', () => {
        return request(app)
        .patch('/api/articles/1000')
        .send({
           inc_votes: 10
        })
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toEqual('Not Found')  
        })
    });
});



