function Test() {
  return (
    <>
      <div className="flex flex-col gap-y-2 m-2">
        <div className="flex flex-col gap-y-1 p-2 bg-gray-700 text-gray-100 rounded">
          <div className="flex gap-x-1">
            <div className="bg-red-500 rounded px-1 grow">text</div>
            <div className="bg-blue-500 rounded px-1">text</div>
          </div>
          <div className="flex gap-x-1">
            <input className="bg-red-500 rounded px-1 grow" defaultValue={"text"} />
            <div className="bg-blue-500 rounded px-1">text</div>
          </div>
        </div>

        <div className="flex flex-col gap-y-1 p-2 bg-gray-700 text-gray-100 rounded">
          <div className="flex gap-x-1">
            <div className="bg-red-500 rounded px-1 grow">text</div>
            <div className="bg-blue-500 rounded px-1">text</div>
          </div>
          <div className="flex gap-x-1">
            <input className="bg-red-500 rounded px-1 grow min-w-0" defaultValue={"text"} />
            <div className="bg-blue-500 rounded px-1">text</div>
          </div>
        </div>

        <div className="flex flex-col gap-y-1 p-2 bg-gray-700 text-gray-100 rounded">
          <div className="flex gap-x-1">
            <div className="bg-red-500 rounded px-1 grow">text</div>
            <div className="bg-blue-500 rounded px-1">text</div>
          </div>
          <div className="flex gap-x-1">
            <div className="flex grow">
              <input className="bg-red-500 rounded px-1 min-w-0 grow" defaultValue={"text"} />
            </div>
            <div className="bg-blue-500 rounded px-1">text</div>
          </div>
        </div>

        <div className="flex flex-col gap-y-1 p-2 bg-gray-700 text-gray-100 rounded">
          <div className="flex gap-x-1">
            <div className="bg-red-500 rounded px-1 grow">text</div>
            <div className="bg-blue-500 rounded px-1">text</div>
          </div>
          <div className="flex gap-x-1">
            <div className="flex grow min-w-0">
              <input className="bg-red-500 rounded px-1 grow min-w-0" defaultValue={"text"} />
            </div>
            <div className="bg-blue-500 rounded px-1">text</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Test;