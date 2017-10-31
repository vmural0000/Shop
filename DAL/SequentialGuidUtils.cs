using System;
using System.Linq;
using System.Runtime.InteropServices;

namespace DAL
{
    public static class SequentialGuidUtils
    {
        public static Guid NewGuid()
        {
            int result = NativeMethods.UuidCreateSequential(out Guid guid);
            if (result == 0)
            {
                var bytes = guid.ToByteArray();
                var indexes = new[] { 3, 2, 1, 0, 5, 4, 7, 6, 8, 9, 10, 11, 12, 13, 14, 15 };
                return new Guid(indexes.Select(i => bytes[i]).ToArray());
            }
            throw new Exception("Error generating sequential GUID");
        }
    }


    internal static class NativeMethods
    {
        [DllImport("rpcrt4.dll", SetLastError = true)]
        public static extern int UuidCreateSequential(out Guid guid);
    }
}