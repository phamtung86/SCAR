export type UserDTO = {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  profilePicture?: string
  createdAt: string
  updatedAt: string
  role: string
  status: string
  verified: boolean
  bio: string
  location: string
  phone: string
  fullName: string
  rating: number
  rank: string
}

export type Location = {
  name: string
  code: number
  codename: string
  division_type: string
  phone_code: number
  wards: [
    {
      name: string
      code: number
      codename: string
      division_type: string
      short_codename: string
    }
  ]
}

export type CreateUserForm = Pick<UserDTO, "username" | "email" | "firstName" | "lastName" | "phone" >

  export type UpdateUserForm = Pick<UserDTO, "firstName" | "lastName" | "email" | "phone" | "verified" | "rank" | "bio" | "location"> 