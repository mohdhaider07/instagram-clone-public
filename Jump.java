public class Jump {
    public static void main(String[] args) {
        int[] arr = { 1, 0, -10, 5, -2, 10, 15, -100, 25, 1, 20 };
        int x = maxSum(arr, 0, 4);
        System.out.println(x);
    }

    public static int maxSum(int[] arr, int idx, int jump) {
        if (idx >= arr.length - 1 && jump == 0) {
            return arr[arr.length - 1];
        }

        int sum = Integer.MIN_VALUE;
        for (int i = 1; i <= 3; i++)
            sum = Math.max(sum, maxSum(arr, idx + i, jump - 1));
        return arr[idx] + sum;

    }
}
