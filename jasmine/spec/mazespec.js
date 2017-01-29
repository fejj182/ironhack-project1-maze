describe("Test Maze Generator", function () {

  it("Creates the maze", function() {

    expect(createMaze().totalCells).toEqual(400);

  });

});
