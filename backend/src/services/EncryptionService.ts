import bcrypt from 'bcrypt'


export default new class EncryptionService {
  comparePassword(givenPassword: string, encryptedPassword: string) {
    return bcrypt.compareSync(givenPassword, encryptedPassword)
  }
}