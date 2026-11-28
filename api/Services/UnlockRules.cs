namespace api.Services;

// The game rules
public static class UnlockRules
{
    // The cat leaves the box after the first quiz attempt
    public static bool CatIsFree(int completedQuizzes) => completedQuizzes >= 1;

    // Every further quiz attempted gives one piece of furniture/progress item
    public static int FurnitureEarned(int completedQuizzes) => Math.Max(completedQuizzes - 1, 0);

    // True only if the student has earned more furniture than they own
    public static bool ShouldUnlockFurniture(int completedQuizzes, int ownedFurniture)
        => FurnitureEarned(completedQuizzes) > ownedFurniture;
}