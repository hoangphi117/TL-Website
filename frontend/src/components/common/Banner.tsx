function Banner() {
  return (
    <section className="flex flex-col gap-2 my-2">
      <div
        className="flex items-center w-full h-[200px] mx-auto px-4 bg-linear-to-r
        from-black to-red-700 rounded-sm "
      >
        {/* {user ? (
          <p className="text-md md:text-5xl text-white font-bold">
            Xin chào, {user.username}!
          </p>
        ) : (
          <div className="flex flex-col">
            <p className="text-3xl md:text-5xl text-white font-bold">
              Chào mừng bạn đến với LiquidShop!
            </p>
            <p className="text-sm text-white mt-3">
              Hãy đăng nhập hoặc đăng ký để trải nghiệm mua sắm tuyệt vời
            </p>
          </div>
        )} */}
        <div className="flex flex-col">
          <p className="text-3xl md:text-5xl text-white font-bold">
            Chào mừng bạn đến với LiquidShop!
          </p>
          <p className="text-sm text-white mt-3">
            Hãy đăng nhập hoặc đăng ký để trải nghiệm mua sắm tuyệt vời
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex h-[160px] w-1/2 items-center justify-center mx-auto px-4 bg-gray-300 ">
          <p>Banner 2</p>
        </div>
        <div className="flex h-[160px] w-1/2 items-center justify-center mx-auto px-4 bg-gray-300 ">
          <p>Banner 3</p>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="hidden md:flex h-[180px] w-1/4 items-center justify-center mx-auto px-4 bg-gray-300 ">
          <p>Banner 4</p>
        </div>
        <div className="hidden md:flex h-[180px] w-1/4 items-center justify-center mx-auto px-4 bg-gray-300 ">
          <p>Banner 5</p>
        </div>
        <div className="hidden md:flex h-[180px] w-1/4 items-center justify-center mx-auto px-4 bg-gray-300 ">
          <p>Banner 6</p>
        </div>
        <div className="hidden md:flex h-[180px] w-1/4 items-center justify-center mx-auto px-4 bg-gray-300 ">
          <p>Banner 7</p>
        </div>
      </div>
    </section>
  );
}

export default Banner;
