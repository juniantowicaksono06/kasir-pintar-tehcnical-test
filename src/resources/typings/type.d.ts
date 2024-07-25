namespace API {
    interface IAPIResponse {
        code: number;
        message: string;
        data: { [key: string]: any }
        errors: object | string;
    }
}

namespace APP {
    interface IUserProfile {
        id: string;
        nip: string;
        name: string;
        email: string;
        phone: string;
        role: 'staff' | 'direktur' | 'finance';
        picture: string;
    }
}