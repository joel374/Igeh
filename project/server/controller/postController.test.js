const { getMockReq, getMockRes } = require("@jest-mock/express")
const postController = require("./postController")

const { res, next } = getMockRes()

describe("Test fetch all products", () => {
  test("fetch all products", async () => {
    const req = getMockReq()

    await postController.getAllPosts(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        mesagge: "Get all post",
        data: expect.arrayContaining([]),
        dataCount: expect.any(Number),
      })
    )
  })
})
