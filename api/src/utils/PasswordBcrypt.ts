import bcrypt from "bcryptjs";

class PasswordUtils {
  public static encryptPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
  };
  public static comparePaswword = async (
    password: string,
    receivedPassword: string
  ): Promise<boolean> => {
    return await bcrypt.compare(password, receivedPassword);
  };
}

export default PasswordUtils;
