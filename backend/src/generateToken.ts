import jwt from 'jsonwebtoken';
export function generateToken(user: any) {
    const payload = {
        username: user.username,
        userId: user.userId
    };
    return jwt.sign(payload, "token");
}

export function verifyToken(token: any){
    try {
        return jwt.verify(token, "token")
        
        
    } catch (error) {
        console.log(error);
        
    }

}