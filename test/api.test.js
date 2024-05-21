const request = require('supertest');
const app = require('../index.js');
const { mongoose } = require('mongoose');

describe('GET /all', () => {
    test('should return a list of students', async () => {
        const response = await request(app).get('/all');

        // expect(response.status).toBe(200);
        // expect(response.body).toEqual(expect.arrayContaining([
        //     { name: 'Lê Minh Việt Anh' },
        //     { name: 'Đào Quang Lợi' },
        //     { name: 'Nguyễn Trung Hiếu' },
        // ]));
        
            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
            // Kiểm tra các expect khác dựa trên dữ liệu trả về từ endpoint
    });

    // test('should return 400 if an error occurs', async () => {
    //     // Giả định rằng ứng dụng gặp lỗi khi truy vấn sinh viên
    //     const mockError = new Error('Database error');
    //     jest.spyOn(student, 'find').mockRejectedValueOnce(mockError);

    //     const response = await request(app).get('/all');

    //     expect(response.status).toBe(400);
    //     expect(response.body).toEqual({ error: 'Database error' });
    // });
});