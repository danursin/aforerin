import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const getExamHtml = async (examId: string): Promise<string> => {
    const s3 = new S3Client();
    const response = await s3.send(new GetObjectCommand({ Bucket: "aforerin", Key: examId }));
    const chunks = [];
    for await (const chunk of response.Body as any) {
        chunks.push(chunk);
    }
    const html = Buffer.concat(chunks).toString("utf-8");
    return html;
};