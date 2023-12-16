import { GetObjectCommand, ListObjectsCommand, S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client();

export const getExamHtml = async (examId: string): Promise<string> => {
    const response = await s3.send(new GetObjectCommand({ Bucket: "aforerin", Key: examId }));
    const chunks = [];
    for await (const chunk of response.Body as any) {
        chunks.push(chunk);
    }
    const html = Buffer.concat(chunks).toString("utf-8");
    return html;
};

export const getExamOptions = async () => {
    const response = await s3.send(new ListObjectsCommand({ Bucket: "aforerin" }));
    const exams = response.Contents?.map((content) => content.Key as string);
    if(!exams){
        throw new Error("No exams found");
    }
    return exams.sort();
};