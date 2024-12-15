class CustomError extends Error {


   mesg: string= ""
    constructor(message: string) {
        super()
        this.mesg= message
      
    }

    getMessage= (): string => {

        return this.mesg;
    }
}