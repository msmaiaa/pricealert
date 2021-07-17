import bcrypt from 'bcrypt'

export default new class Encryption {
  comparePassword(givenPassword: string, encryptedPassword: string) {
    return bcrypt.compareSync(givenPassword, encryptedPassword)
  }
}